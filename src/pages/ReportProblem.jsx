import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Input, Select, TextArea, useTitle } from "../components/ui"
import { ValidationProcess } from "../components/ValidationProcess"
import { useStore } from "../context/Store"
import { buildValidationReport, pathForRole } from "../data/logic"
import { DISTRICTS, DOMAINS } from "../data/seed"

const CAN_FILE = ["citizen", "community", "government"]

export default function ReportProblem() {
  useTitle("Report a problem")
  const { user, reportProblem, problems, institutions } = useStore()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [district, setDistrict] = useState("Ranchi")
  const [location, setLocation] = useState("")
  const [domain, setDomain] = useState("")
  const [uploads, setUploads] = useState([])
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)

  const report = useMemo(() => {
    if (!result) return null
    return buildValidationReport(result, problems, institutions)
  }, [result, problems, institutions])

  if (!user || !CAN_FILE.includes(user.role)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-5xl">Report a problem</h1>
        <p className="mt-4 leading-7 text-muted">
          {user
            ? "Campus and industry desks respond to briefs. File one from a citizen, community, or department account."
            : "Sign in as a citizen, a community group, or a department to put a challenge in the queue."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/sign-in" className="inline-flex rounded-full bg-navy px-5 py-3 text-sm text-white">
            Sign in
          </Link>
          {user ? null : (
            <Link to="/register" className="inline-flex rounded-full border border-line bg-card px-5 py-3 text-sm">
              Create an account
            </Link>
          )}
        </div>
      </div>
    )
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (title.trim().length < 8) {
      setError("Give the problem a title of at least 8 characters.")
      return
    }
    if (description.trim().length < 30) {
      setError("Describe what is happening in at least a sentence or two.")
      return
    }
    setError("")
    setBusy(true)
    const draft = await reportProblem({
      title,
      description,
      district,
      location,
      domain,
      files: uploads.map((file) => file.name),
      file: uploads[0],
      owner: user,
    })
    setBusy(false)
    setResult(draft)
  }

  if (result && report) {
    return (
      <ValidationProcess
        report={report}
        problem={result}
        user={user}
        onDone={() => navigate(pathForRole(user.role))}
        onFileAnother={() => {
          setResult(null)
          setTitle("")
          setDescription("")
          setLocation("")
          setDomain("")
          setUploads([])
        }}
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Citizen engagement</p>
      <h1 className="mt-2 font-display text-3xl sm:text-5xl">Report a problem</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Signed in as {user.name}. Add the place and what is failing. Photographs and short videos can ride along as file names in this demo.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
        <Input label="Title *" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={140} placeholder="Handpumps dry in Palkot hamlets" required />
        <div>
          <TextArea label="Describe the challenge *" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={800} placeholder="Who is affected, since when, and what you have already tried. Provide as much detail as possible." required rows={5} />
          <p className={`mt-1 text-xs ${description.trim().length >= 30 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
            {description.trim().length}/800 characters (minimum 30 required)
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="District *" value={district} onChange={(event) => setDistrict(event.target.value)} required>
            {DISTRICTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Input label="Village, block, or ward" value={location} onChange={(event) => setLocation(event.target.value)} />
        </div>
        <label className="block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
          Photographs, video, or documents
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf"
            className="mt-1.5 block w-full text-sm font-normal normal-case tracking-normal"
            onChange={(event) => setUploads([...(event.target.files || [])])}
          />
        </label>
        {uploads.length > 0 ? <p className="text-xs text-muted">{uploads.map((file) => file.name).join(", ")}</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <Button type="submit" disabled={busy}>{busy ? "Reading the report…" : "Submit challenge"}</Button>
      </form>
    </div>
  )
}
