import { useNavigate } from "react-router-dom"
import { useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { DEMO_USERS } from "../data/seed"
import { pathForRole } from "../data/logic"

const STOPS = [
  {
    role: "citizen",
    title: "Citizen files what they can see",
    body: "Asha Kumari has three cases: dry handpumps in Palkot, locked school toilets in Masalia, and a completed street-light map in Ranchi. Open her desk, then check status on any row.",
  },
  {
    role: "government",
    title: "The department validates and routes",
    body: "Innovation Cell sees the queue, a campus request from Central University of Jharkhand, and Ranchi University waiting for approval. Route Masalia, or accept the Latehar request.",
  },
  {
    role: "university",
    title: "The campus accepts and builds a team",
    body: "Dr. Meera Kujur at Central University of Jharkhand can accept the Murhu school brief, request an open problem, and invite Mahindra Rise, Tata Trusts, or Bosch India.",
  },
  {
    role: "industry",
    title: "A partner says yes or no",
    body: "Rohan Sen at Bosch India has a collaboration request for the Godda haat cold store. Accept it and the citizen-facing status moves to collaborating.",
  },
]

export default function LiveDemo() {
  useTitle("Live demo")
  const { signIn } = useStore()
  const navigate = useNavigate()

  const open = (role) => {
    const user = DEMO_USERS[role]
    signIn(user)
    navigate(pathForRole(user.role))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Live demo</p>
      <h1 className="mt-2 max-w-3xl font-display text-5xl leading-tight sm:text-6xl">Walk the same case across four desks.</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        Nothing here calls a server. The workspace lives in this browser, so a decision on one desk shows up on the next.
      </p>
      <ol className="mt-10 space-y-4">
        {STOPS.map((stop, index) => (
          <li key={stop.role} className="grid gap-4 rounded-[28px] border border-line bg-card p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <span className="font-display text-4xl text-accent">0{index + 1}</span>
            <div>
              <h2 className="text-xl font-semibold">{stop.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{stop.body}</p>
            </div>
            <button type="button" onClick={() => open(stop.role)} className="rounded-full bg-navy px-4 py-2.5 text-sm font-medium text-white">
              Open this desk
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
