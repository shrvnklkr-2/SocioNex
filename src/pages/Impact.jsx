import { ListeningCard, MomentumChart } from "../components/Charts"
import { StatGrid } from "../components/StatGrid"
import { useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { domainPressure } from "../data/logic"
import { DISTRICT_SNAPSHOT } from "../data/seed"

export default function Impact() {
  useTitle("Impact")
  const { problems } = useStore()
  const domains = domainPressure(problems)
  const max = domains[0]?.count || 1

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Statewide picture</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">What the state can see.</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Headline numbers are the statewide baseline. Filing a challenge in this workspace moves the live counts, and the domain bars pick up that case.
      </p>
      <div className="mt-8">
        <StatGrid problems={problems} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <h2 className="font-display text-3xl">Challenge momentum</h2>
          <p className="mt-1 text-sm text-muted">Submitted and resolved, April to September</p>
          <MomentumChart tall />
        </article>
        <ListeningCard />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <h2 className="font-display text-3xl">Thematic pressure</h2>
          <ul className="mt-5 space-y-3">
            {domains.map((item) => (
              <li key={item.domain}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{item.domain}</span>
                  <span className="text-muted">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-mist">
                  <div className="h-2 rounded-full bg-navy" style={{ width: `${(item.count / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <h2 className="font-display text-3xl">Districts</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="py-2 font-medium">District</th>
                  <th className="py-2 font-medium">Open</th>
                  <th className="py-2 font-medium">Pilot</th>
                  <th className="py-2 font-medium">Closed</th>
                </tr>
              </thead>
              <tbody>
                {DISTRICT_SNAPSHOT.map((row) => (
                  <tr key={row.district} className="border-t border-line">
                    <td className="py-2.5">{row.district}</td>
                    <td>{row.open}</td>
                    <td>{row.pilot}</td>
                    <td>{row.closed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </div>
  )
}
