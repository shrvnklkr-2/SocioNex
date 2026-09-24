import { useCallback, useEffect, useRef, useState } from "react"
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision"
import { Button } from "./ui"

const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm"
const MODEL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"

const JOINTS = {
  nose: 0,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
}

function angle(a, b, c) {
  if (!a || !b || !c) return null
  if (Math.min(a.visibility ?? 1, b.visibility ?? 1, c.visibility ?? 1) < 0.45) return null
  const abx = a.x - b.x
  const aby = a.y - b.y
  const cbx = c.x - b.x
  const cby = c.y - b.y
  const dot = abx * cbx + aby * cby
  const mag = Math.sqrt(abx * abx + aby * aby) * Math.sqrt(cbx * cbx + cby * cby)
  if (!mag) return null
  return Math.round((Math.acos(Math.min(1, Math.max(-1, dot / mag))) * 180) / Math.PI)
}

function readPose(landmarks) {
  const at = (key) => landmarks[JOINTS[key]]
  const leftKnee = angle(at("leftHip"), at("leftKnee"), at("leftAnkle"))
  const rightKnee = angle(at("rightHip"), at("rightKnee"), at("rightAnkle"))
  const leftElbow = angle(at("leftShoulder"), at("leftElbow"), at("leftWrist"))
  const rightElbow = angle(at("rightShoulder"), at("rightElbow"), at("rightWrist"))
  const hips = [at("leftHip"), at("rightHip")].filter((p) => (p?.visibility ?? 0) > 0.4)
  const ankles = [at("leftAnkle"), at("rightAnkle")].filter((p) => (p?.visibility ?? 0) > 0.4)
  const hipY = hips.length ? hips.reduce((n, p) => n + p.y, 0) / hips.length : 0
  const ankleY = ankles.length ? ankles.reduce((n, p) => n + p.y, 0) / ankles.length : 0
  const kneeAvg = [leftKnee, rightKnee].filter((n) => n != null)
  const squat = kneeAvg.length && kneeAvg.every((n) => n < 140) && ankleY - hipY < 0.38
  return {
    leftKnee,
    rightKnee,
    leftElbow,
    rightElbow,
    stance: squat ? "Squat / sit" : "Upright",
  }
}

function drawSkeleton(ctx, poses, width, height) {
  ctx.clearRect(0, 0, width, height)
  const connections = PoseLandmarker.POSE_CONNECTIONS || []
  poses.forEach((landmarks, index) => {
    ctx.strokeStyle = index === 0 ? "#7aa2ff" : "#3dcea0"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    connections.forEach((pair) => {
      const start = landmarks[pair.start]
      const end = landmarks[pair.end]
      if (!start || !end || (start.visibility ?? 1) < 0.4 || (end.visibility ?? 1) < 0.4) return
      ctx.beginPath()
      ctx.moveTo(start.x * width, start.y * height)
      ctx.lineTo(end.x * width, end.y * height)
      ctx.stroke()
    })
    landmarks.forEach((point) => {
      if ((point.visibility ?? 1) < 0.45) return
      ctx.beginPath()
      ctx.fillStyle = "#f4f7ff"
      ctx.arc(point.x * width, point.y * height, 4, 0, Math.PI * 2)
      ctx.fill()
    })
  })
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-line bg-mist px-3 py-3">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value ?? "—"}</p>
    </div>
  )
}

export function PoseTracker() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const landmarkerRef = useRef(null)
  const streamRef = useRef(null)
  const frameRef = useRef(0)
  const lastTsRef = useRef(0)
  const fpsStampRef = useRef(0)
  const fpsCountRef = useRef(0)
  const [ready, setReady] = useState(false)
  const [running, setRunning] = useState(false)
  const [status, setStatus] = useState("Load the pose model, then start the camera.")
  const [fps, setFps] = useState(0)
  const [people, setPeople] = useState(0)
  const [metrics, setMetrics] = useState(null)

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setRunning(false)
    setPeople(0)
    setFps(0)
    setMetrics(null)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setStatus("Loading pose model…")
        const vision = await FilesetResolver.forVisionTasks(WASM)
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL, delegate: "GPU" },
          runningMode: "VIDEO",
          numPoses: 2,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })
        if (cancelled) {
          landmarker.close()
          return
        }
        landmarkerRef.current = landmarker
        setReady(true)
        setStatus("Model ready. Start the camera to track pose in real time.")
      } catch {
        if (!cancelled) setStatus("The pose model could not load. Check the network and try again.")
      }
    })()
    return () => {
      cancelled = true
      cancelAnimationFrame(frameRef.current)
      streamRef.current?.getTracks().forEach((track) => track.stop())
      landmarkerRef.current?.close()
      landmarkerRef.current = null
    }
  }, [])

  const loop = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const landmarker = landmarkerRef.current
    if (!video || !canvas || !landmarker || video.readyState < 2) {
      frameRef.current = requestAnimationFrame(loop)
      return
    }
    const now = performance.now()
    if (now - lastTsRef.current > 12) {
      lastTsRef.current = now
      const result = landmarker.detectForVideo(video, now)
      const poses = result?.landmarks ?? []
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      drawSkeleton(canvas.getContext("2d"), poses, canvas.width, canvas.height)
      setPeople(poses.length)
      setMetrics(poses[0] ? readPose(poses[0]) : null)
      fpsCountRef.current += 1
      if (now - fpsStampRef.current >= 1000) {
        setFps(fpsCountRef.current)
        fpsCountRef.current = 0
        fpsStampRef.current = now
      }
    }
    frameRef.current = requestAnimationFrame(loop)
  }, [])

  const start = async () => {
    if (!landmarkerRef.current) return
    try {
      setStatus("Asking for the camera…")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      const video = videoRef.current
      video.srcObject = stream
      await video.play()
      lastTsRef.current = 0
      fpsStampRef.current = performance.now()
      fpsCountRef.current = 0
      setRunning(true)
      setStatus("Tracking. Stand in frame so shoulders and hips are visible.")
      frameRef.current = requestAnimationFrame(loop)
    } catch {
      setStatus("Camera access was blocked. Allow the camera for this site and try again.")
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.7fr)]">
      <div className="overflow-hidden rounded-[28px] border border-line bg-navy">
        <div className="relative aspect-video bg-black">
          <video ref={videoRef} className="absolute inset-0 h-full w-full -scale-x-100 object-cover" playsInline muted />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full -scale-x-100 object-cover" />
          {!running ? (
            <div className="absolute inset-0 grid place-items-center bg-navy/70 p-6 text-center text-sm text-white/80">
              {ready ? "Start the camera to overlay a live skeleton." : status}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3 p-4">
          {running ? (
            <Button variant="ghost" onClick={stopLoop}>
              Stop camera
            </Button>
          ) : (
            <Button onClick={start} disabled={!ready}>
              Start live tracking
            </Button>
          )}
          <p className="text-sm text-white/75">{status}</p>
        </div>
      </div>
      <aside className="space-y-3 rounded-[28px] border border-line bg-card p-5">
        <h2 className="font-display text-3xl">Live readouts</h2>
        <div className="grid grid-cols-2 gap-2">
          <Metric label="People" value={people} />
          <Metric label="FPS" value={running ? fps : "—"} />
          <Metric label="Left knee" value={metrics?.leftKnee != null ? `${metrics.leftKnee}°` : "—"} />
          <Metric label="Right knee" value={metrics?.rightKnee != null ? `${metrics.rightKnee}°` : "—"} />
          <Metric label="Left elbow" value={metrics?.leftElbow != null ? `${metrics.leftElbow}°` : "—"} />
          <Metric label="Right elbow" value={metrics?.rightElbow != null ? `${metrics.rightElbow}°` : "—"} />
        </div>
        <p className="rounded-2xl bg-mist px-3 py-3 text-sm">
          Stance: <span className="font-semibold">{metrics?.stance || "Not in frame"}</span>
        </p>
        <p className="text-xs leading-5 text-muted">
          Video stays in this browser. The model runs locally after it downloads. Use it for accessibility and field-motion briefs, not for identifying people.
        </p>
      </aside>
    </div>
  )
}
