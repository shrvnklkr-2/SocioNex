const PINS = [
  { name: "Gumla", x: 132, y: 250 },
  { name: "Ranchi", x: 196, y: 210 },
  { name: "Dumka", x: 268, y: 168 },
  { name: "Dhanbad", x: 250, y: 128 },
  { name: "Jamshedpur", x: 230, y: 292 },
]

export function StateMap() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg viewBox="0 0 420 460" className="h-auto w-full" role="img" aria-label="Stylized map of Jharkhand with report pins">
        <path
          d="M210 36C286 28 348 78 372 142C392 196 356 228 368 286C380 348 318 412 226 424C146 434 78 392 70 328C60 262 104 236 86 176C70 112 132 46 210 36Z"
          fill="var(--cream)"
          stroke="var(--map-ink)"
          strokeWidth="3"
        />
        <path
          d="M168 120C196 108 230 126 236 156C242 184 214 196 196 214C176 234 150 220 146 190C142 156 146 130 168 120Z"
          fill="var(--cream-deep)"
          stroke="var(--map-ink)"
          strokeWidth="1.4"
        />
        <text x="210" y="250" textAnchor="middle" fill="var(--map-ink)" fontFamily="Fraunces, Georgia, serif" fontSize="42">
          Jharkhand
        </text>
        {PINS.map((pin) => (
          <g key={pin.name} transform={`translate(${pin.x} ${pin.y})`}>
            <circle className="ping-soft" r="8" fill="var(--indigo)" opacity="0.35" />
            <circle r="4.5" fill="var(--map-ink)" />
            <text y="-12" textAnchor="middle" fontSize="11" fill="var(--map-ink)" fontFamily="Outfit, sans-serif">
              {pin.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
