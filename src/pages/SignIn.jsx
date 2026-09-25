import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button, Input, useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { pathForRole } from "../data/logic"
import { useLanguage } from "../i18n/LanguageContext"
import { LanguageSwitcher } from "../i18n/LanguageSwitcher"

const ROLE_IDS = ["citizen", "community", "university", "industry", "government"]

const DEFAULT_LOGINS = {
  citizen: { email: "rakesh.mahato@example.com", password: "demo123" },
  community: { email: "hello@gramvikas.example", password: "demo123" },
  university: { email: "coordinator@bitmesra-innovation.example.edu", password: "demo123" },
  industry: { email: "partnerships@mahindrarise.example.com", password: "demo123" },
  government: { email: "gov@jharkhand.gov.in", password: "demo123" },
}

export default function SignIn() {
  useTitle("Sign in")
  const { t } = useLanguage()
  const { login, reset } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const requested = params.get("role")
  const initialRole = ROLE_IDS.includes(requested) ? requested : "citizen"
  const initial = DEFAULT_LOGINS[initialRole]
  const [role, setRole] = useState(initialRole)
  const [email, setEmail] = useState(initial.email)
  const [password, setPassword] = useState(initial.password)
  const [error, setError] = useState("")

  const tip = DEFAULT_LOGINS[role]
  const roleLabel = t(`auth.${role}`)

  const finish = (user) => navigate(pathForRole(user.role))

  const fillDefault = (nextRole = role) => {
    const defaults = DEFAULT_LOGINS[nextRole]
    setRole(nextRole)
    setEmail(defaults.email)
    setPassword(defaults.password)
    setError("")
  }

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
      <div className="mb-6 flex justify-center">
        <LanguageSwitcher />
      </div>
      <h1 className="text-center font-display text-5xl">{t("auth.signIn")}</h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-muted">
        {t("auth.samplePassword")}
      </p>
      <div className="mt-8 text-center">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">{t("auth.selectRole")}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {ROLE_IDS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={role === item}
              onClick={() => fillDefault(item)}
              className={`rounded-full px-4 py-2 text-sm ${role === item ? "bg-navy text-white" : "border border-line bg-card text-ink"}`}
            >
              {t(`auth.${item}`)}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
        <p className="rounded-2xl border border-dashed border-line bg-mist/40 px-3 py-2 text-xs leading-5 text-muted">
          {t("auth.defaultDesk", { role: roleLabel })}:{" "}
          <span className="font-medium text-ink">{tip.email}</span>
          {" · "}
          password <span className="font-medium text-ink">{tip.password}</span>
        </p>
        <Input label={t("auth.email")} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" />
        <Input label={t("auth.password")} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <Button type="submit" className="w-full">{t("auth.signIn")}</Button>
        <button type="button" onClick={() => fillDefault(role)} className="w-full text-xs text-muted underline">
          {t("auth.fillDefault", { role: roleLabel })}
        </button>
        <p className="text-sm text-muted">
          {t("auth.newAccount")}{" "}
          <Link to={`/register?role=${role}`} className="font-medium text-accent">{t("auth.createAccount")}</Link>
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
