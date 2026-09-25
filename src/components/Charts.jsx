import { Link } from "react-router-dom"
import { ArrowUpRight, Sparkles } from "lucide-react"

function smoothPath(series, x, y) {
  if (!series.length) return ""
  const points = series.map((value, index) => [x(index), y(value)])
  let path = `M ${points[0][0]} ${points[0][1]}`
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] || points[index]
    const p1 = points[index]
    const p2 = points[index + 1]
    const p3 = points[index + 2] || p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`
  }
  return path
}

export function MomentumChart({ tall = false, months = [], submitted = [], resolved = [] }) {
  const labels = months.length ? months : ["—"]
  const submittedSeries = submitted.length ? submitted : labels.map(() => 0)
  const resolvedSeries = resolved.length ? resolved : labels.map(() => 0)
  const width = 560
  const height = tall ? 280 : 230
  const padX = 36
  const padY = 24
  const peak = Math.max(4, ...submittedSeries, ...resolvedSeries)
  const tickStep = peak <= 4 ? 1 : Math.ceil(peak / 4)
  const ticks = [tickStep, tickStep * 2, tickStep * 3, tickStep * 4].filter((tick) => tick <= peak * 1.05)
  const max = ticks[ticks.length - 1] || peak
  const x = (index) =>
    labels.length === 1 ? width / 2 : padX + (index * (width - padX * 2)) / (labels.length - 1)
  const y = (value) => height - padY - 16 - (value / max) * (height - padY * 2 - 16)
  const submittedPath = smoothPath(submittedSeries, x, y)
  const resolvedPath = smoothPath(resolvedSeries, x, y)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Challenges submitted and resolved over recent months">
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={padX} x2={width - padX} y1={y(tick)} y2={y(tick)} stroke="var(--line)" />
          <text x={4} y={y(tick) + 4} fill="var(--muted)" fontSize="11">
            {tick}
          </text>
        </g>
      ))}
      {submittedPath ? (
        <>
          <path d={`${submittedPath} L ${x(labels.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`} fill="var(--indigo)" opacity="0.12" />
          <path d={submittedPath} fill="none" stroke="var(--indigo)" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : null}
      {resolvedPath ? (
        <path d={resolvedPath} fill="none" stroke="var(--mint)" strokeWidth="3" strokeLinecap="round" />
      ) : null}
      {labels.map((month, index) => (
        <text key={`${month}-${index}`} x={x(index)} y={height - 6} textAnchor="middle" fill="var(--muted)" fontSize="12">
          {month}
        </text>
      ))}
    </svg>
  )
}

export function ListeningCard({ contributors = 0, districts = 0 }) {
  const dots = [
    [28, 96],
    [92, 78],
    [150, 52],
    [214, 70],
    [286, 40],
    [338, 58],
  ]
  return (
    <article className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-6 text-white sm:p-7 shadow-[0_0_25px_-2px_rgba(16,185,129,0.25)] border border-emerald-500/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.18em] text-emerald-300 uppercase">NETWORK SIGNAL</p>
          <h3 className="mt-2 font-display text-[1.7rem] leading-tight font-normal">The system is listening</h3>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 backdrop-blur-sm text-emerald-300">
          <Sparkles className="h-4 w-4" />
        </span>
      </div>
      <svg viewBox="0 0 360 130" className="mt-4 h-32 w-full" aria-hidden="true">
        <path
          d="M 20 100 C 70 100, 90 48, 150 52 S 250 108, 346 36"
          fill="none"
          stroke="rgba(16, 185, 129, 0.45)"
          strokeDasharray="4 7"
          strokeWidth="1.5"
        />
        {dots.map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="8" fill="rgba(16, 185, 129, 0.25)" />
            <circle cx={cx} cy={cy} r="3.5" fill="#a7f3d0" />
          </g>
        ))}
      </svg>
      <div className="mt-2 grid grid-cols-2 gap-4 pt-2">
        <div>
          <p className="text-3xl font-bold tracking-tight text-emerald-200">{contributors.toLocaleString()}</p>
          <p className="text-sm text-emerald-100/70">active contributors</p>
        </div>
        <div>
          <p className="text-3xl font-bold tracking-tight text-emerald-200">{districts.toLocaleString()}</p>
          <p className="text-sm text-emerald-100/70">districts represented</p>
        </div>
      </div>
      <Link to="/impact" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300 hover:text-white transition-colors">
        Explore network analytics <ArrowUpRight className="h-4 w-4" />
      </Link>
    </article>
  )
}
