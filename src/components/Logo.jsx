export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 dark:bg-emerald-500">
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
          <circle cx="16" cy="8" r="2.5" fill="currentColor" />
          <circle cx="9" cy="22" r="2.5" fill="currentColor" />
          <circle cx="23" cy="22" r="2.5" fill="currentColor" />
          <path d="M16 10.5 L9.5 20 M16 10.5 L22.5 20 M11.5 22 H20.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-sm font-extrabold tracking-[0.25em] text-emerald-950 dark:text-white">SOCIONEX</span>
    </span>
  )
}


