import { useEffect, useRef, useState } from "react"
import { Bell } from "lucide-react"
import { formatDate, visibleEvents } from "../data/logic"
import { useStore } from "../context/Store"

export function Notifications() {
  const { user, events } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const items = visibleEvents(user, events).slice(0, 6)

  useEffect(() => {
    const onPointer = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false)
    }
    window.addEventListener("pointerdown", onPointer)
    return () => window.removeEventListener("pointerdown", onPointer)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-card"
      >
        <Bell className="h-4 w-4" />
        {items.length > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo" /> : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-3xl border border-line bg-card p-3 shadow-xl">
          <p className="px-2 py-1 text-xs font-semibold tracking-[0.14em] text-muted uppercase">Updates</p>
          {items.length === 0 ? (
            <p className="px-2 py-3 text-sm text-muted">Nothing new for this desk.</p>
          ) : (
            <ul className="mt-1 space-y-1">
              {items.map((item) => (
                <li key={item.id} className="rounded-2xl px-2 py-2 text-sm leading-5 hover:bg-mist">
                  {item.text}
                  <span className="mt-1 block text-xs text-muted">{formatDate(item.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
