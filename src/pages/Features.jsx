import { useTitle } from "../components/ui"
import { SpotlightCarousel } from "../components/SpotlightCarousel"

const MODULES = [
  {
    title: "Citizen engagement",
    body: "Individuals, community groups, panchayats, urban local bodies, and departments file a challenge with the place, a description, and photos or documents.",
    points: ["Web form a field worker can finish", "District and locality on every brief", "Evidence stays attached to the case"],
  },
  {
    title: "Problem intelligence",
    body: "A browser classifier suggests a domain, flags a likely duplicate, and points at a campus whose listed expertise matches. A department still confirms the route.",
    points: ["Eleven thematic domains", "Overlap check against open titles", "Suggested institute, not a silent assignment"],
  },
  {
    title: "University collaboration",
    body: "A campus reviews what was routed to it, accepts or declines, requests an open brief, and keeps departments and faculty on the profile the state can see.",
    points: ["Accept or decline a routed brief", "Ask the department for an open one", "Faculty, labs, and expertise on one profile"],
  },
  {
    title: "Industry partnership",
    body: "Startups, MSMEs, CSR teams, and labs receive a specific request: the problem, the campus, and a yes or no. Mentorship, funding, and prototyping sit on that decision.",
    points: ["One request card per invitation", "Accept or reject in the same place", "Partner fit shown beside the brief"],
  },
  {
    title: "Project lifecycle",
    body: "Each case carries the same trail: submitted, validated, assigned, team formed, partner joined, pilot, deployed. The campus advances the last two steps.",
    points: ["Shared milestones", "Notes when a case is returned", "Completed stays visible to the person who filed it"],
  },
  {
    title: "Government analytics",
    body: "Departments see volume, what is still in validation, which campuses are waiting for approval, and how domains and districts are moving.",
    points: ["Statewide picture plus the live queue", "Approve a new institution", "Route or return a brief"],
  },
  {
    title: "Notifications",
    body: "Each desk gets the updates that belong to it: a new filing, a campus request, an industry decision, a pilot checkpoint.",
    points: ["Bell on every workspace", "Role-specific messages", "Status wording the citizen can read"],
  },
  {
    title: "Real-time pose tracking",
    body: "A field camera draws a live skeleton and joint angles in the browser. Useful for accessibility, rehab, and labour-motion briefs without uploading video.",
    points: ["Webcam skeleton overlay", "Knee and elbow angles", "Runs locally after the model loads"],
  },
]

export default function Features() {
  useTitle("Features")
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Spotlight Carousel Hero */}
      <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/60 sm:p-8">
        <SpotlightCarousel />
      </section>

      {/* Module Overview Grid */}
      <section>
        <p className="text-[11px] font-bold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-400">THE PORTAL DESKS</p>
        <h1 className="mt-2 font-display text-4xl font-normal text-slate-900 sm:text-5xl dark:text-white">
          Seven desks, one case file.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          Socionex is the front end of a societal innovation portal for Jharkhand. These modules are wired together so a report can travel the full path.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {MODULES.map((module, index) => (
            <article key={module.title} className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-bold text-slate-400">0{index + 1}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">{module.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{module.body}</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                {module.points.map((point) => (
                  <li key={point} className="flex gap-2 items-center">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
