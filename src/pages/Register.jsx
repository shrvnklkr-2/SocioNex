import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button, Input, Select, useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { pathForRole } from "../data/logic"

const ROLES = [
  { id: "citizen", label: "Citizen" },
  { id: "community", label: "Community" },
  { id: "university", label: "University" },
  { id: "industry", label: "Industry" },
  { id: "government", label: "Government" },
]

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

export default function Register() {
  useTitle("Create account")
  const { enter } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const requested = params.get("role")
  const [role, setRole] = useState(ROLES.some((item) => item.id === requested) ? requested : "citizen")
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [certificate, setCertificate] = useState("")

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const finish = (user) => {
    if (!user) return
    navigate(pathForRole(user.role))
  }

  const submitCitizen = async (event) => {
    event.preventDefault()
    const next = passwordErrors(form)
    if (!form.name.trim()) next.name = "Add the name people should see."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email."
    if (form.aadhaar && !/^\d{12}$/.test(form.aadhaar)) next.aadhaar = "Aadhaar must be 12 digits, or leave it blank."
    setErrors(next)
    if (Object.keys(next).length) return
    finish(await enter({ role: "citizen", name: form.name.trim(), email: form.email, password: form.password }))
  }

  const submitCommunity = async (event) => {
    event.preventDefault()
    const next = passwordErrors(form)
    if (!form.org.trim()) next.org = "Add the organisation name."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email."
    if (form.phone && form.phone.replace(/\D/g, "").length < 10) next.phone = "Enter a 10-digit phone number."
    setErrors(next)
    if (Object.keys(next).length) return
    finish(await enter({
      role: "community",
      name: form.org.trim(),
      email: form.email,
      password: form.password,
      address: form.address.trim(),
      phone: form.phone.trim(),
      roleLabel: form.roleLabel,
    }))
  }

  const submitUniversity = async (event) => {
    event.preventDefault()
    const next = passwordErrors(form)
    if (!form.org.trim()) next.org = "Add the institution name."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email."
    if (!form.location.trim()) next.location = "Add the campus location."
    setErrors(next)
    if (Object.keys(next).length) return
    finish(await enter({
      role: "university",
      name: form.name.trim() || form.org.trim(),
      email: form.email,
      password: form.password,
      org: form.org.trim(),
      type: form.type,
      location: form.location.trim(),
      licence: form.licence.trim(),
    }))
  }

  const submitIndustry = async (event) => {
    event.preventDefault()
    const next = passwordErrors(form)
    if (!form.org.trim()) next.org = "Add the organisation name."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email."
    setErrors(next)
    if (Object.keys(next).length) return
    finish(await enter({
      role: "industry",
      name: form.name.trim() || form.org.trim(),
      email: form.email,
      password: form.password,
      org: form.org.trim(),
      scale: form.scale,
      location: form.location.trim(),
      gstin: form.gstin.trim(),
      certificate,
    }))
  }

  const submitGovernment = async (event) => {
    event.preventDefault()
    const next = passwordErrors(form)
    if (!form.department.trim()) next.department = "Add the department."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email."
    setErrors(next)
    if (Object.keys(next).length) return
    finish(await enter({
      role: "government",
      name: form.name.trim() || form.department.trim(),
      email: form.email,
      password: form.password,
      org: form.department.trim(),
    }))
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-center font-display text-5xl">Create an account</h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-muted">
        Register the desk you belong to. The password is stored only in this browser so you can sign in later.
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
                setErrors({})
              }}
              className={`rounded-full px-4 py-2 text-sm ${role === item.id ? "bg-navy text-white" : "border border-line bg-card text-ink"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {role === "citizen" ? (
        <form onSubmit={submitCitizen} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <Input label="Name" value={form.name} onChange={set("name")} error={errors.name} />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
          <Input label="Aadhaar card no." inputMode="numeric" maxLength={12} value={form.aadhaar} onChange={set("aadhaar")} error={errors.aadhaar} hint="Optional. Not stored." />
          <Input label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} autoComplete="new-password" />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" />
          <Button type="submit" className="w-full">Create citizen account</Button>
        </form>
      ) : null}

      {role === "community" ? (
        <form onSubmit={submitCommunity} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <Input label="Name" value={form.org} onChange={set("org")} error={errors.org} />
          <Input label="Address" value={form.address} onChange={set("address")} />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
          <Input label="Phone no." value={form.phone} onChange={set("phone")} error={errors.phone} />
          <Select label="Role" value={form.roleLabel} onChange={set("roleLabel")}>
            <option>NGO</option>
            <option>Sarpanch</option>
            <option>Society representative</option>
          </Select>
          <Input label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} autoComplete="new-password" />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" />
          <Button type="submit" className="w-full">Create community account</Button>
        </form>
      ) : null}

      {role === "university" ? (
        <form onSubmit={submitUniversity} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
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
          <Input label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} autoComplete="new-password" />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" />
          <Button type="submit" className="w-full">Create university account</Button>
          <p className="text-xs leading-5 text-muted">New campuses wait for a government approval before they can take a brief.</p>
        </form>
      ) : null}

      {role === "industry" ? (
        <form onSubmit={submitIndustry} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
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
          <label className="block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
            Certificate
            <input
              type="file"
              className="mt-1.5 block w-full text-sm font-normal normal-case tracking-normal"
              onChange={(event) => setCertificate(event.target.files?.[0]?.name || "")}
            />
          </label>
          <Input label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} autoComplete="new-password" />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" />
          <Button type="submit" className="w-full">Create industry account</Button>
        </form>
      ) : null}

      {role === "government" ? (
        <form onSubmit={submitGovernment} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <Input label="Department" value={form.department} onChange={set("department")} error={errors.department} />
          <Input label="Your name" value={form.name} onChange={set("name")} />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
          <Input label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} autoComplete="new-password" />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" />
          <Button type="submit" className="w-full">Create department account</Button>
        </form>
      ) : null}

      <p className="mt-6 text-center text-sm text-muted">
        Already registered?{" "}
        <Link to={`/sign-in?role=${role}`} className="font-medium text-accent">Sign in</Link>
      </p>
    </div>
  )
}
