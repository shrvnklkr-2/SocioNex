import { useMemo } from "react"
import { ListeningCard, MomentumChart } from "../components/Charts"
import { StatGrid } from "../components/StatGrid"
import { useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { districtSnapshot, domainPressure, momentumFromProblems, networkFromProblems } from "../data/logic"

export default function Impact() {
  useTitle("Impact")
  const { problems, overview, categoryStats, leaderboard, mapData, apiOnline } = useStore()
  const domains = categoryStats?.length
    ? categoryStats.map((item) => ({ domain: item.category, count: item.count }))
    : domainPressure(problems)
  const max = domains[0]?.count || 1
  const momentum = useMemo(() => momentumFromProblems(problems), [problems])
  const network = useMemo(() => networkFromProblems(problems, overview), [problems, overview])
  const districts = useMemo(() => districtSnapshot(problems), [problems])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Statewide picture</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">What the state can see.</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        {apiOnline
          ? "These counts update from live filings on SocioNex."
          : "Headline numbers are local until the FastAPI server is running on port 8001."}
      </p>
      <div className="mt-8">
        <StatGrid problems={problems} overview={overview} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <h2 className="font-display text-3xl">Challenge momentum</h2>
          <p className="mt-1 text-sm text-muted">Submitted and resolved over the last six months</p>
          <MomentumChart
            tall
            months={momentum.map((item) => item.label)}
            submitted={momentum.map((item) => item.submitted)}
            resolved={momentum.map((item) => item.resolved)}
          />
        </article>
        <ListeningCard contributors={network.contributors} districts={network.districts} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <h2 className="font-display text-3xl">Thematic pressure</h2>
          {domains.length === 0 ? (
            <p className="mt-5 text-sm text-muted">No domain activity yet. New filings will appear here.</p>
          ) : (
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
          )}
        </article>
        <article className="rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <h2 className="font-display text-3xl">{mapData?.length ? "Map points" : "Districts"}</h2>
          <div className="mt-4 overflow-x-auto">
            {mapData?.length ? (
              <table className="w-full text-left text-sm">
                <thead className="text-xs tracking-wide text-muted uppercase">
                  <tr>
                    <th className="py-2 font-medium">Place</th>
                    <th className="py-2 font-medium">Lat</th>
                    <th className="py-2 font-medium">Lng</th>
                  </tr>
                </thead>
                <tbody>
                  {mapData.slice(0, 8).map((row) => (
                    <tr key={row.id} className="border-t border-line">
                      <td className="py-2.5">{row.district}</td>
                      <td>{row.lat}</td>
                      <td>{row.lng}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : districts.length ? (
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
                  {districts.map((row) => (
                    <tr key={row.district} className="border-t border-line">
                      <td className="py-2.5">{row.district}</td>
                      <td>{row.open}</td>
                      <td>{row.pilot}</td>
                      <td>{row.closed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted">No district activity yet.</p>
            )}
          </div>
          {leaderboard?.universities?.length ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold">University leaderboard</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {leaderboard.universities.map((item) => (
                  <li key={item.name} className="flex justify-between gap-3">
                    <span>{item.name}</span>
                    <span className="text-muted">{item.score}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      </div>
    </div>
  )
}
