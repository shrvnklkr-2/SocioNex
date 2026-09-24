import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Logo } from "./Logo"
import { ThemeToggle } from "./Theme"
import { pathForRole } from "../data/logic"
import { useStore } from "../context/Store"

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/live-demo", label: "Live demo" },
  { to: "/pose", label: "Pose track" },
  { to: "/features", label: "Features" },
  { to: "/impact", label: "Impact" },
]

export function Navbar() {
  const { user } = useStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const goWorkspace = () => {
    setOpen(false)
    navigate(user ? pathForRole(user.role) : "/sign-in")
  }

  const goRegister = () => {
    setOpen(false)
    navigate("/register")
  }

  const linkClass = ({ isActive }) =>
    `text-sm tracking-wide ${isActive ? "text-ink font-semibold" : "text-muted hover:text-ink"}`

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" aria-label="Socionex home" onClick={() => setOpen(false)}>
          <Logo />
        </NavLink>
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? null : (
            <button type="button" onClick={goRegister} className="hidden text-sm text-muted hover:text-ink md:inline">
              Register
            </button>
          )}
          <button type="button" onClick={goWorkspace} className="hidden rounded-full border border-line bg-card px-4 py-2 text-sm font-medium md:inline-flex">
            {user ? "Workspace" : "Sign in"}
          </button>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden" aria-label="Menu" onClick={() => setOpen((value) => !value)}>
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-line px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
            {user ? null : (
              <button type="button" onClick={goRegister} className="text-left text-sm text-muted">
                Register
              </button>
            )}
            <button type="button" onClick={goWorkspace} className="mt-2 rounded-full bg-navy px-4 py-2 text-sm text-white">
              {user ? "Workspace" : "Sign in"}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <Logo />
          <p className="mt-3 max-w-md leading-6">
            A Jharkhand workspace where a local report can become a campus project and a field pilot.
          </p>
        </div>
        <p>National Education Policy 2020 · community engagement, in practice.</p>
      </div>
    </footer>
  )
}

export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main>{children ?? <Outlet />}</main>
      <Footer />
    </div>
  )
}
