import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button, Input, Select, useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { pathForRole } from "../data/logic"
import { useLanguage } from "../i18n/LanguageContext"
import { LanguageSwitcher } from "../i18n/LanguageSwitcher"

const ROLES = [
  { id: "citizen", label: "Citizen" },
  { id: "community", label: "Community" },
  { id: "university", label: "University" },
  { id: "industry", label: "Industry" },
  { id: "government", label: "Government" },
]

const DEFAULT_LOGINS = {
  citizen: {
    email: "rakesh.mahato@example.com",
    password: "demo123",
    label: "Citizen sample",
  },
  community: {
    email: "hello@gramvikas.example",
    password: "demo123",
    label: "Community sample",
  },
  university: {
    email: "coordinator@bitmesra-innovation.example.edu",
    password: "demo123",
    label: "University sample",
  },
  industry: {
    email: "partnerships@mahindrarise.example.com",
    password: "demo123",
    label: "Industry sample",
  },
  government: {
    email: "gov@jharkhand.gov.in",
    password: "demo123",
    label: "Government sample",
  },
}

const EMPTY = {
  name: "",
  email: "",
  password: "",
  confirm: "",
  aadhaar: "",
  address: "",
  phone: "",
  roleLabel: "NGO",
  org: "",
  type: "State University",
  location: "",
  licence: "",
  scale: "Startup",
  gstin: "",
  department: "",
}

function passwordErrors(form) {
  const next = {}
  if (form.password.length < 6) next.password = "Use at least 6 characters."
  if (form.password !== form.confirm) next.confirm = "Those passwords do not match."
  return next
}

function DefaultLoginHint({ role }) {
  const tip = DEFAULT_LOGINS[role]
  if (!tip) return null
  return (
    <p className="rounded-2xl border border-dashed border-line bg-mist/40 px-3 py-2 text-xs leading-5 text-muted">
      Default {tip.label}: <span className="font-medium text-ink">{tip.email}</span>
      {" · "}
      password <span className="font-medium text-ink">{tip.password}</span>
    </p>
  )
}

function GovIdField({ file, onChange, error }) {
  const { t } = useLanguage()
  return (
    <label className="block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
      {t("auth.govId")}
      <input
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        className="mt-1.5 block w-full rounded-2xl border border-line bg-card px-3 py-2.5 text-sm font-normal normal-case tracking-normal file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
      <span className="mt-1.5 block text-xs font-normal normal-case tracking-normal text-muted">
        {t("auth.govIdHint")}
        {file ? ` ${file.name}` : ""}
      </span>
      {error ? <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-rose-600">{error}</span> : null}
    </label>
  )
}

export default function Register() {
  useTitle("Create account")
  const { t } = useLanguage()
  const { enter } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const requested = params.get("role")
  const [role, setRole] = useState(ROLES.some((item) => item.id === requested) ? requested : "citizen")
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [certificate, setCertificate] = useState("")
  const [govId, setGovId] = useState(null)

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const finish = (user) => {
    if (!user) return
    navigate(pathForRole(user.role))
  }

  const withGovId = (payload) => ({
    ...payload,
    govIdName: govId?.name || "",
  })

  const submitCitizen = async (event) => {
    event.preventDefault()
    const next = passwordErrors(form)
    if (!form.name.trim()) next.name = "Add the name people should see."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email."
    if (form.aadhaar && !/^\d{12}$/.test(form.aadhaar)) next.aadhaar = "Aadhaar must be 12 digits, or leave it blank."
    setErrors(next)
    if (Object.keys(next).length) return
    finish(await enter(withGovId({ role: "citizen", name: form.name.trim(), email: form.email, password: form.password })))
  }

  const submitCommunity = async (event) => {
    event.preventDefault()
    const next = passwordErrors(form)
    if (!form.org.trim()) next.org = "Add the organisation name."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email."
    if (form.phone && form.phone.replace(/\D/g, "").length < 10) next.phone = "Enter a 10-digit phone number."
    setErrors(next)
    if (Object.keys(next).length) return
    finish(await enter(withGovId({
      role: "community",
      name: form.org.trim(),
      email: form.email,
      password: form.password,
      address: form.address.trim(),
      phone: form.phone.trim(),
      roleLabel: form.roleLabel,
    })))
  }

  const submitUniversity = async (event) => {
    event.preventDefault()
    const next = passwordErrors(form)
    if (!form.org.trim()) next.org = "Add the institution name."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email."
    if (!form.location.trim()) next.location = "Add the campus location."
    setErrors(next)
    if (Object.keys(next).length) return
    finish(await enter(withGovId({
      role: "university",
      name: form.name.trim() || form.org.trim(),
      email: form.email,
      password: form.password,
      org: form.org.trim(),
      type: form.type,
      location: form.location.trim(),
      licence: form.licence.trim(),
    })))
  }

  const submitIndustry = async (event) => {
    event.preventDefault()
    const next = passwordErrors(form)
    if (!form.org.trim()) next.org = "Add the organisation name."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email."
    setErrors(next)
    if (Object.keys(next).length) return
    finish(await enter(withGovId({
      role: "industry",
      name: form.name.trim() || form.org.trim(),
      email: form.email,
      password: form.password,
      org: form.org.trim(),
      scale: form.scale,
      location: form.location.trim(),
      gstin: form.gstin.trim(),
      certificate,
    })))
  }

  const submitGovernment = async (event) => {
    event.preventDefault()
    const next = passwordErrors(form)
    if (!form.department.trim()) next.department = "Add the department."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email."
    setErrors(next)
    if (Object.keys(next).length) return
    finish(await enter(withGovId({
      role: "government",
      name: form.name.trim() || form.department.trim(),
      email: form.email,
      password: form.password,
      org: form.department.trim(),
    })))
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex justify-center">
        <LanguageSwitcher />
      </div>
      <h1 className="text-center font-display text-5xl">{t("auth.register")}</h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-muted">
        {t("auth.samplePassword")}
      </p>
      <div className="mt-8 text-center">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">{t("auth.selectRole")}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {ROLES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={role === item.id}
              onClick={() => {
                setRole(item.id)
                setErrors({})
                setGovId(null)
              }}
              className={`rounded-full px-4 py-2 text-sm ${role === item.id ? "bg-navy text-white" : "border border-line bg-card text-ink"}`}
            >
              {t(`auth.${item.id}`)}
            </button>
          ))}
        </div>
      </div>

      {role === "citizen" ? (
        <form onSubmit={submitCitizen} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <DefaultLoginHint role="citizen" />
          <Input label="Name" value={form.name} onChange={set("name")} error={errors.name} />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
          <Input label="Aadhaar card no." inputMode="numeric" maxLength={12} value={form.aadhaar} onChange={set("aadhaar")} error={errors.aadhaar} hint="Optional. Not stored." />
          <GovIdField file={govId} onChange={setGovId} error={errors.govId} />
          <Input label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} autoComplete="new-password" />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" />
          <Button type="submit" className="w-full">{t("auth.createCitizen")}</Button>
        </form>
      ) : null}

      {role === "community" ? (
        <form onSubmit={submitCommunity} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <DefaultLoginHint role="community" />
          <Input label="Name" value={form.org} onChange={set("org")} error={errors.org} />
          <Input label="Address" value={form.address} onChange={set("address")} />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
          <Input label="Phone no." value={form.phone} onChange={set("phone")} error={errors.phone} />
          <Select label="Role" value={form.roleLabel} onChange={set("roleLabel")}>
            <option>NGO</option>
            <option>Sarpanch</option>
            <option>Society representative</option>
          </Select>
          <GovIdField file={govId} onChange={setGovId} error={errors.govId} />
          <Input label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} autoComplete="new-password" />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" />
          <Button type="submit" className="w-full">{t("auth.createCommunity")}</Button>
        </form>
      ) : null}

      {role === "university" ? (
        <form onSubmit={submitUniversity} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <DefaultLoginHint role="university" />
          <Input label="Institution name" value={form.org} onChange={set("org")} error={errors.org} />
          <Input label="Your name" value={form.name} onChange={set("name")} hint="Coordinator or faculty contact." />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
          <Select label="Type" value={form.type} onChange={set("type")}>
            <option>Central University</option>
            <option>State University</option>
            <option>NIT</option>
            <option>IIT</option>
            <option>Medical Institute</option>
            <option>Other</option>
          </Select>
          <Input label="Location" value={form.location} onChange={set("location")} error={errors.location} />
          <Input label="Licence no." value={form.licence} onChange={set("licence")} />
          <GovIdField file={govId} onChange={setGovId} error={errors.govId} />
          <Input label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} autoComplete="new-password" />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" />
          <Button type="submit" className="w-full">{t("auth.createUniversity")}</Button>
          <p className="text-xs leading-5 text-muted">New campuses wait for a government approval before they can take a brief.</p>
        </form>
      ) : null}

      {role === "industry" ? (
        <form onSubmit={submitIndustry} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <DefaultLoginHint role="industry" />
          <Input label="Name" value={form.org} onChange={set("org")} error={errors.org} />
          <Input label="Contact name" value={form.name} onChange={set("name")} />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
          <Select label="Scale" value={form.scale} onChange={set("scale")}>
            <option>Startup</option>
            <option>MSME</option>
            <option>Large industry</option>
            <option>CSR organisation</option>
            <option>Research lab</option>
          </Select>
          <Input label="GSTIN" value={form.gstin} onChange={set("gstin")} />
          <Input label="Location" value={form.location} onChange={set("location")} />
          <GovIdField file={govId} onChange={setGovId} error={errors.govId} />
          <label className="block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
            Company certificate
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              className="mt-1.5 block w-full text-sm font-normal normal-case tracking-normal"
              onChange={(event) => setCertificate(event.target.files?.[0]?.name || "")}
            />
          </label>
          <Input label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} autoComplete="new-password" />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" />
          <Button type="submit" className="w-full">{t("auth.createIndustry")}</Button>
        </form>
      ) : null}

      {role === "government" ? (
        <form onSubmit={submitGovernment} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <DefaultLoginHint role="government" />
          <Input label="Department" value={form.department} onChange={set("department")} error={errors.department} />
          <Input label="Your name" value={form.name} onChange={set("name")} />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
          <GovIdField file={govId} onChange={setGovId} error={errors.govId} />
          <Input label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} autoComplete="new-password" />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" />
          <Button type="submit" className="w-full">{t("auth.createGovernment")}</Button>
        </form>
      ) : null}

      <p className="mt-6 text-center text-sm text-muted">
        {t("auth.haveAccount")}{" "}
        <Link to={`/sign-in?role=${role}`} className="font-medium text-accent">{t("auth.signInLink")}</Link>
      </p>
    </div>
  )
}
