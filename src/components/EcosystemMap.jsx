import { useState } from "react"
import { User, GraduationCap, Building2, Landmark, Users } from "lucide-react"

const NODES = [
  {
    id: "citizen",
    title: "Citizen",
    subtitle: "Reports a problem",
    icon: User,
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.4)",
    pos: { x: 22, y: 24 },
  },
  {
    id: "university",
    title: "University",
    subtitle: "Validates & matches",
    icon: GraduationCap,
    color: "from-teal-500 to-emerald-700",
    glow: "rgba(20, 184, 166, 0.4)",
    pos: { x: 50, y: 20 },
  },
  {
    id: "industry",
    title: "Industry",
    subtitle: "Builds & scales",
    icon: Building2,
    color: "from-emerald-600 to-teal-800",
    glow: "rgba(5, 150, 105, 0.4)",
    pos: { x: 80, y: 26 },
  },
  {
    id: "government",
    title: "Government",
    subtitle: "Approves & enables",
    icon: Landmark,
    color: "from-teal-600 to-emerald-600",
    glow: "rgba(13, 148, 136, 0.4)",
    pos: { x: 40, y: 72 },
  },
  {
    id: "ngo",
    title: "NGO / Community",
    subtitle: "Brings local context",
    icon: Users,
    color: "from-emerald-400 to-teal-600",
    glow: "rgba(52, 211, 153, 0.4)",
    pos: { x: 74, y: 76 },
  },
]

const BADGES = [
  { text: "Clean water initiative approved", x: 42, y: 12 },
  { text: "Local problem reported", x: 28, y: 56 },
  { text: "Pilot project approved", x: 78, y: 54 },
]

export function EcosystemMap() {
  const [hoveredNode, setHoveredNode] = useState(null)

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 p-4 shadow-xl shadow-emerald-900/5 backdrop-blur-sm dark:border-emerald-800/50 dark:from-emerald-950/80 dark:via-slate-900 dark:to-emerald-950/90 sm:p-6 lg:p-8">
      {/* Background dotted grid pattern representing regional map */}
      <div className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-15">
        <svg className="h-full w-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" className="fill-emerald-600 dark:fill-emerald-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>

      {/* Decorative soft glowing spots */}
      <div className="pointer-events-none absolute -top-16 left-1/4 h-64 w-64 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-700/20" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl dark:bg-teal-700/20" />

      <div className="relative aspect-[16/11] min-h-[380px] w-full sm:min-h-[440px]">
        {/* SVG Network Connecting Paths */}
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 800 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient-emerald-teal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="gradient-teal-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Path: Citizen -> University */}
          <path
            d="M 176 120 C 260 90, 310 90, 400 100"
            fill="none"
            stroke="url(#gradient-emerald-teal)"
            strokeWidth="3"
            filter="url(#glow)"
            className="transition-all duration-300"
          />
          <circle cx="280" cy="100" r="4" className="animate-ping fill-emerald-400 opacity-75" />

          {/* Path: University -> Industry */}
          <path
            d="M 400 100 C 480 80, 560 90, 640 130"
            fill="none"
            stroke="url(#gradient-teal-emerald)"
            strokeWidth="3"
            filter="url(#glow)"
          />
          <circle cx="520" cy="95" r="4" className="animate-ping fill-teal-400 opacity-75" />

          {/* Path: University -> Government */}
          <path
            d="M 400 100 C 430 200, 360 280, 320 360"
            fill="none"
            stroke="url(#gradient-emerald-teal)"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />

          {/* Path: Citizen -> Government */}
          <path
            d="M 176 120 C 180 250, 240 320, 320 360"
            fill="none"
            stroke="url(#gradient-teal-emerald)"
            strokeWidth="2.5"
            filter="url(#glow)"
          />

          {/* Path: Government -> NGO */}
          <path
            d="M 320 360 C 420 390, 500 390, 592 380"
            fill="none"
            stroke="url(#gradient-emerald-teal)"
            strokeWidth="3"
            filter="url(#glow)"
          />

          {/* Path: NGO -> Industry */}
          <path
            d="M 592 380 C 660 320, 670 220, 640 130"
            fill="none"
            stroke="url(#gradient-teal-emerald)"
            strokeWidth="2.5"
            filter="url(#glow)"
          />
        </svg>

        {/* Status Badges */}
        {BADGES.map((badge, idx) => (
          <div
            key={idx}
            style={{ left: `${badge.x}%`, top: `${badge.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/80 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-emerald-900 shadow-md shadow-emerald-900/5 backdrop-blur-md dark:border-emerald-700/60 dark:bg-emerald-950/90 dark:text-emerald-200"
          >
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {badge.text}
            </span>
          </div>
        ))}

        {/* Stakeholder Nodes */}
        {NODES.map((node) => {
          const Icon = node.icon
          const isHovered = hoveredNode === node.id

          return (
            <div
              key={node.id}
              style={{ left: `${node.pos.x}%`, top: `${node.pos.y}%` }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            >
              {/* Outer Pulse Ring */}
              <div
                className={`absolute inset-0 -m-3 rounded-full transition-all duration-300 ${
                  isHovered ? "scale-125 opacity-100" : "scale-100 opacity-40 group-hover:opacity-80"
                }`}
                style={{
                  background: `radial-gradient(circle, ${node.glow} 0%, transparent 70%)`,
                }}
              />

              <div className="flex flex-col items-center text-center">
                {/* Node Icon Container */}
                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${node.color} text-white shadow-lg transition-all duration-300 group-hover:scale-110 sm:h-16 sm:w-16`}
                  style={{
                    boxShadow: isHovered ? `0 10px 25px -5px ${node.glow}` : undefined,
                  }}
                >
                  <Icon className="h-7 w-7 transition-transform group-hover:scale-110 sm:h-8 sm:w-8" />
                  
                  {/* Active dot indicator */}
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-400 border-2 border-white dark:border-emerald-950" />
                  </span>
                </div>

                {/* Node Labels */}
                <div className="mt-2.5 max-w-[130px] rounded-xl bg-white/90 px-2.5 py-1 backdrop-blur-md transition-colors dark:bg-emerald-950/90 shadow-sm border border-emerald-100/60 dark:border-emerald-800/40">
                  <h4 className="text-xs font-bold text-emerald-950 dark:text-white sm:text-sm">{node.title}</h4>
                  <p className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 sm:text-[11px]">{node.subtitle}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
