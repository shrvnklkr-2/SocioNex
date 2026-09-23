import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Pause, Play } from "lucide-react"
import { ListeningCard, MomentumChart } from "../components/Charts"
import { StateMap } from "../components/StateMap"
import { useTitle } from "../components/ui"

const STEPS = [
  {
    title: "A citizen reports",
    body: "A handpump has failed in Palkot. The report carries the village name, two photos, and who is walking for water.",
  },
  {
    title: "The queue sorts it",
    body: "The brief is tagged Water resources, checked against open cases, and marked high priority for the department.",
  },
  {
    title: "A campus is matched",
    body: "Birsa Agricultural University is suggested from its water and rural engineering work, then asked to accept.",
  },
  {
    title: "Industry joins the pilot",
    body: "A partner brings sensors and a field mentor. The district, the campus, and the citizen watch the same milestones.",
  },
]

const PIPELINE = [
  {
    index: "01",
    title: "AI challenge validation",
    body: "Group similar reports, score urgency, and keep the queue free of repeats before a person reviews it.",
  },
  {
    index: "02",
    title: "University matching",
    body: "Send a validated brief to the campus whose departments, labs, and faculty already work in that domain.",
  },
  {
    index: "03",
    title: "Industry collaboration",
    body: "Invite a mentor, funder, MSME, or lab when a student team needs money, a prototype, or a pilot site.",
  },
  {
    index: "04",
    title: "Project lifecycle tracking",
    body: "Follow review, team formation, milestones, field tests, and the outcome the community can see.",
  },
]

export default function Home() {
  useTitle("Home")
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return undefined
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return undefined
    const timer = window.setInterval(() => setStep((value) => (value + 1) % STEPS.length), 3200)
    return () => window.clearInterval(timer)
  }, [playing])

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
      <section className="grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div className="rise">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">Jharkhand · citizens, campuses, companies</p>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[0.95] text-ink sm:text-7xl">
            Transform challenges into real solutions.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted">
            People already know what is breaking. Socionex gives that report a path through validation, a university team, and an industry partner who can help put it in the field.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/report" className="rounded-full bg-navy px-5 py-3 text-sm font-medium text-white">
              Report a problem
            </Link>
            <Link to="/live-demo" className="rounded-full border border-line bg-card px-5 py-3 text-sm font-medium">
              Watch the path
            </Link>
          </div>
        </div>
        <StateMap />
      </section>

      <section className="rounded-[32px] bg-navy px-5 py-8 text-white sm:px-10 sm:py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-white/50">ONE SIGNAL · MANY HANDS</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight sm:text-5xl">
              From a local observation to a shared outcome.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-white/70">Report, validate, match a campus, then pilot with someone who can build.</p>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {PIPELINE.map((item) => (
            <article key={item.index} className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <p className="text-xs text-white/45">{item.index}</p>
              <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-[28px] border border-line bg-card p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl">Momentum is measurable.</h2>
              <p className="mt-1 text-sm text-muted">Submission and resolution velocity · last 6 months</p>
            </div>
            <Link to="/impact" className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted">
              View analytics
            </Link>
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-indigo" /> Submitted</span>
            <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-mint" /> Resolved</span>
          </div>
          <MomentumChart />
        </article>
        <div className="grid gap-4">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Impact</p>
          <article className="flex flex-1 flex-col justify-between rounded-[28px] bg-navy p-6 text-white">
            <h2 className="font-display text-3xl leading-tight">The next solution could begin with you.</h2>
            <Link to="/report" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0c1733]">
              Report a challenge <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Live demo</p>
            <h2 className="mt-1 font-display text-4xl">One report, four desks.</h2>
          </div>
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Pause" : "Play"}
          </button>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-line bg-card">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-line p-6 lg:border-r lg:border-b-0">
              <ol className="space-y-2">
                {STEPS.map((item, index) => (
                  <li key={item.title}>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(index)
                        setPlaying(false)
                      }}
                      className={`w-full rounded-2xl px-3 py-3 text-left ${step === index ? "bg-mist" : "hover:bg-paper"}`}
                    >
                      <span className="text-xs text-muted">0{index + 1}</span>
                      <span className="mt-1 block font-medium">{item.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex min-h-64 flex-col justify-between bg-cream p-6 sm:p-10">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">Live demo video</p>
              <div>
                <h3 className="font-display text-4xl leading-tight">{STEPS[step].title}</h3>
                <p className="mt-4 max-w-md text-base leading-7 text-ink/80">{STEPS[step].body}</p>
              </div>
              <Link to="/live-demo" className="mt-8 text-sm font-medium text-accent">
                Open the full walkthrough
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <ListeningCard />
      </section>
    </div>
  )
}
