import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Input, Select, TextArea, useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { pathForRole } from "../data/logic"
import { DISTRICTS, DOMAINS } from "../data/seed"

const CAN_FILE = ["citizen", "community", "government"]

export default function ReportProblem() {
  useTitle("Report a problem")
  const { user, reportProblem } = useStore()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [district, setDistrict] = useState("Ranchi")
  const [location, setLocation] = useState("")
  const [domain, setDomain] = useState("")
  const [files, setFiles] = useState([])
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)

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

  const onSubmit = (event) => {
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
    const wait = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 700
    window.setTimeout(() => {
      const draft = reportProblem({
        title,
        description,
        district,
        location,
        domain,
        files,
        owner: user,
      })
      setBusy(false)
      setResult(draft)
    }, wait)
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Demo classifier</p>
        <h1 className="mt-2 font-display text-5xl">Filed in the validation queue.</h1>
        <div className="mt-6 space-y-3 rounded-[28px] border border-line bg-card p-6 text-sm leading-6">
          <p><span className="text-muted">Domain · </span>{result.domain}</p>
          <p><span className="text-muted">Priority · </span>{result.priority}</p>
          <p>
            <span className="text-muted">Suggested campus · </span>
            {result.suggestedUniversityName || "No approved campus listed for this domain yet"}
          </p>
          <p>
            <span className="text-muted">Duplicate check · </span>
            {result.duplicateTitle ? `Possible duplicate of “${result.duplicateTitle}”.` : "No close title in the open queue."}
          </p>
          <p className="text-muted">
            Keyword rules in this browser did the sorting. A department still has to validate the brief before a campus is assigned.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => navigate(pathForRole(user.role))}>Open your desk</Button>
          <Button variant="ghost" onClick={() => { setResult(null); setTitle(""); setDescription(""); setFiles([]) }}>
            File another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Citizen engagement</p>
      <h1 className="mt-2 font-display text-5xl">Report a problem</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Signed in as {user.name}. Add the place and what is failing. Photographs and short videos can ride along as file names in this demo.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-[28px] border border-line bg-card p-5 sm:p-6">
        <Input label="Title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={140} placeholder="Handpumps dry in Palkot hamlets" />
        <TextArea label="What is happening" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={800} placeholder="Who is affected, since when, and what you have already tried." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="District" value={district} onChange={(event) => setDistrict(event.target.value)}>
            {DISTRICTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Input label="Village, block, or ward" value={location} onChange={(event) => setLocation(event.target.value)} />
        </div>
        <Select label="Domain hint" value={domain} onChange={(event) => setDomain(event.target.value)} hint="Leave this on automatic and the demo classifier will choose.">
          <option value="">Classify for me</option>
          {DOMAINS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
        <label className="block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
          Photographs, video, or documents
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf"
            className="mt-1.5 block w-full text-sm font-normal normal-case tracking-normal"
            onChange={(event) => setFiles([...(event.target.files || [])].map((file) => file.name))}
          />
        </label>
        {files.length > 0 ? <p className="text-xs text-muted">{files.join(", ")}</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <Button type="submit" disabled={busy}>{busy ? "Reading the report…" : "Submit challenge"}</Button>
      </form>
    </div>
  )
}
