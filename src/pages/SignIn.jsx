import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button, Input, useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { pathForRole } from "../data/logic"
import { DEMO_PASSWORD, DEMO_USERS } from "../data/seed"

const ROLES = [
  { id: "citizen", label: "Citizen" },
  { id: "community", label: "Community" },
  { id: "university", label: "University" },
  { id: "industry", label: "Industry" },
  { id: "government", label: "Government" },
]

const DEMO_HINT = {
  citizen: DEMO_USERS.citizen.email,
  community: DEMO_USERS.community.email,
  university: DEMO_USERS.university.email,
  industry: DEMO_USERS.industry.email,
  government: DEMO_USERS.government.email,
}

export default function SignIn() {
  useTitle("Sign in")
  const { login, signIn, reset } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const requested = params.get("role")
  const [role, setRole] = useState(ROLES.some((item) => item.id === requested) ? requested : "citizen")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const finish = (user) => navigate(pathForRole(user.role))

  const submit = async (event) => {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter the email you registered with.")
      return
    }
    if (!password) {
      setError("Enter your password.")
      return
    }
    const result = await login({ role, email, password })
    if (result.error) {
      setError(result.error)
      return
    }
    finish(result.user)
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-center font-display text-5xl">Sign in</h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-muted">
        Use the email and password for your desk. You will land in that workspace.
      </p>
      <div className="mt-8 text-center">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Select role</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {ROLES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={role === item.id}
              onClick={() => {
                setRole(item.id)
                setError("")
              }}
              className={`rounded-full px-4 py-2 text-sm ${role === item.id ? "bg-navy text-white" : "border border-line bg-card text-ink"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" />
        <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <Button type="submit" className="w-full">Sign in</Button>
        <p className="text-sm text-muted">
          New to Socionex?{" "}
          <Link to={`/register?role=${role}`} className="font-medium text-accent">Create an account</Link>
        </p>
        <p className="text-xs leading-5 text-muted">
          Sample {role} desk: {DEMO_HINT[role]} · password {DEMO_PASSWORD}
        </p>
      </form>
      <section className="mt-8 rounded-[28px] border border-dashed border-line bg-card/70 p-5">
        <h2 className="text-sm font-semibold">Open a sample desk</h2>
        <p className="mt-1 text-sm text-muted">Skips the password and loads the shared cases.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(DEMO_USERS).map(([key, user]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                signIn(user)
                finish(user)
              }}
              className="rounded-full border border-line bg-card px-3 py-2 text-sm hover:bg-mist"
            >
              {ROLES.find((item) => item.id === user.role)?.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={reset} className="mt-4 text-xs text-muted underline">
          Reset workspace data
        </button>
      </section>
    </div>
  )
}
