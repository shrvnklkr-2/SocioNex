export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-card">
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
          <circle cx="16" cy="8" r="2.2" fill="currentColor" />
          <circle cx="9" cy="21" r="2.2" fill="currentColor" />
          <circle cx="23" cy="21" r="2.2" fill="currentColor" />
          <path d="M16 10.4 L10.2 18.4 M16 10.4 L21.8 18.4 M11.4 21 H20.6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-[13px] font-semibold tracking-[0.22em] text-ink">SOCIONEX</span>
    </span>
  )
}
