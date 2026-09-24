import { PoseTracker } from "../components/PoseTracker"
import { useTitle } from "../components/ui"

export default function PoseTrack() {
  useTitle("Pose tracking")
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Field capture</p>
      <h1 className="mt-2 font-display text-5xl leading-tight sm:text-6xl">Real-time pose tracking.</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        The camera draws a live skeleton and joint angles in this tab. Teams working on accessibility, rehab, or physical labour briefs can check posture without sending the video to a server.
      </p>
      <div className="mt-8">
        <PoseTracker />
      </div>
    </div>
  )
}
