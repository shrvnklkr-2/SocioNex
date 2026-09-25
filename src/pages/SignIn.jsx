import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button, Input, useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { pathForRole } from "../data/logic"

const ROLES = [
  { id: "citizen", label: "Citizen" },
  { id: "community", label: "Community" },
  { id: "university", label: "University" },
  { id: "industry", label: "Industry" },
  { id: "government", label: "Government" },
]

export default function SignIn() {
  useTitle("Sign in")
  const { login, reset } = useStore()
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
      </form>
      <div className="mt-6 text-center">
        <button type="button" onClick={reset} className="text-xs text-muted underline">
          Reset workspace data
        </button>
      </div>
    </div>
  )
}
