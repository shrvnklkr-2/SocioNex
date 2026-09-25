import { Link } from "react-router-dom"
import { useTitle } from "../components/ui"

const STOPS = [
  {
    role: "citizen",
    title: "Citizen files what they can see",
    body: "Register a citizen account, file a local problem, then track status as campuses and partners pick it up.",
  },
  {
    role: "government",
    title: "The department validates and routes",
    body: "Create a government desk to review the queue, validate filings, and route briefs to campuses.",
  },
  {
    role: "university",
    title: "The campus accepts and builds a team",
    body: "Open a university account to accept briefs, assign departments, and invite industry partners.",
  },
  {
    role: "industry",
    title: "A partner says yes or no",
    body: "Register as industry to respond to collaboration requests and move a case into a shared pilot.",
  },
]

export default function LiveDemo() {
  useTitle("How it works")

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Walkthrough</p>
      <h1 className="mt-2 max-w-3xl font-display text-5xl leading-tight sm:text-6xl">Walk the same case across four desks.</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        Create your own accounts for each role. There are no shared demo logins — register, then move a case desk to desk.
      </p>
      <ol className="mt-10 space-y-4">
        {STOPS.map((stop, index) => (
          <li key={stop.role} className="grid gap-4 rounded-[28px] border border-line bg-card p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <span className="font-display text-4xl text-accent">0{index + 1}</span>
            <div>
              <h2 className="text-xl font-semibold">{stop.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{stop.body}</p>
            </div>
            <Link
              to={`/register?role=${stop.role}`}
              className="rounded-full bg-navy px-4 py-2.5 text-center text-sm font-medium text-white"
            >
              Create {stop.role} account
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
