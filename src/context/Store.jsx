import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { api as http, mapApiChallenge, mapApiUniversity } from "../api"
import { buildProblem, hashPassword, matchRecommendations, sessionUser, slugify, uid } from "../data/logic"
import { createInitialState, INSTITUTIONS } from "../data/seed"

const KEY = "socionex-workspace-v3"
const StoreContext = createContext(null)

function enrichUniversity(row) {
  const mapped = mapApiUniversity(row)
  const seed =
    INSTITUTIONS.find((item) => item.name === mapped.name) ||
    INSTITUTIONS.find((item) => item.id === mapped.id)
  if (!seed) return mapped
  return {
    ...mapped,
    depts: seed.depts?.length ? seed.depts : mapped.depts,
    faculty: seed.faculty?.length ? seed.faculty : mapped.faculty,
    expertise: mapped.expertise?.length ? mapped.expertise : seed.expertise,
    type: seed.type || mapped.type,
    location: mapped.location || seed.location,
    about: mapped.about || seed.about,
  }
}

function sameCampus(a, b) {
  if (!a || !b) return false
  return (
    String(a.id) === String(b.id)
    || (a.name && b.name && a.name.trim().toLowerCase() === b.name.trim().toLowerCase())
  )
}

function mergeInstitutions(apiList, localList) {
  const local = Array.isArray(localList) ? localList : []
  const api = Array.isArray(apiList) ? apiList : []
  const merged = api.map((row) => {
    const prev = local.find((item) => sameCampus(item, row))
    if (!prev) return row
    return {
      ...row,
      about: prev.about || row.about,
      expertise: prev.expertise?.length ? prev.expertise : row.expertise,
      depts: prev.depts?.length ? prev.depts : row.depts || [],
      faculty: prev.faculty?.length ? prev.faculty : row.faculty || [],
      accepted: prev.accepted ?? row.accepted,
      declined: prev.declined ?? row.declined,
      type: prev.type || row.type,
      location: prev.location || row.location,
    }
  })
  for (const item of local) {
    if (!merged.some((row) => sameCampus(row, item))) merged.push(item)
  }
  return merged
}

function campusProfileFromUser(user, partial = {}, { pendingApproval = false } = {}) {
  const name = partial.org || user?.org || user?.name || "Campus"
  const id = user?.universityId || partial.universityId || name
  return {
    id,
    name,
    type: partial.type || "Higher education institution",
    location: partial.location || "",
    licence: partial.licence || "",
    about: "",
    expertise: [],
    depts: [],
    faculty: [],
    accepted: !pendingApproval,
    declined: false,
  }
}

function upsertInstitution(list, next) {
  const existing = list.find((item) => sameCampus(item, next))
  if (!existing) return [...list, next]
  return list.map((item) =>
    sameCampus(item, next)
      ? {
          ...item,
          ...next,
          depts: next.depts ?? item.depts,
          faculty: next.faculty ?? item.faculty,
          expertise: next.expertise ?? item.expertise,
        }
      : item,
  )
}

function fillMatchHints(problem, institutions) {
  if (!problem?.domain || !institutions?.length) return problem
  if (problem.suggestedDepartment && problem.suggestedFaculty && problem.suggestedUniversityName) {
    return problem
  }
  const pool = problem.suggestedUniversityId || problem.suggestedUniversityName
    ? institutions.filter(
        (item) =>
          item.id === problem.suggestedUniversityId ||
          item.name === problem.suggestedUniversityName ||
          item.id === problem.universityId ||
          item.name === problem.universityName,
      )
    : institutions
  const top = matchRecommendations(problem.domain, pool.length ? pool : institutions, 1)[0]
  if (!top) return problem
  return {
    ...problem,
    suggestedUniversityId: problem.suggestedUniversityId || top.universityId,
    suggestedUniversityName: problem.suggestedUniversityName || top.universityName,
    suggestedDepartment: problem.suggestedDepartment || top.department,
    suggestedFaculty: problem.suggestedFaculty || top.facultyName,
    suggestedFacultyTitle: problem.suggestedFacultyTitle || top.facultyTitle,
  }
}

function mergeChallenges(apiProblems, localProblems, institutions) {
  const localById = new Map(localProblems.map((item) => [String(item.id), item]))
  const merged = apiProblems.map((api) => {
    const local = localById.get(String(api.id))
    localById.delete(String(api.id))
    const early = ["submitted", "in_validation", "rejected"].includes(api.status)
    const next = {
      ...api,
      suggestedUniversityId: local?.suggestedUniversityId || api.suggestedUniversityId,
      suggestedUniversityName: local?.suggestedUniversityName || api.suggestedUniversityName,
      suggestedDepartment: local?.suggestedDepartment || api.suggestedDepartment,
      suggestedFaculty: local?.suggestedFaculty || api.suggestedFaculty,
      suggestedFacultyTitle: local?.suggestedFacultyTitle || api.suggestedFacultyTitle,
      feedback: local?.feedback ?? api.feedback,
      duplicateOf: local?.duplicateOf ?? api.duplicateOf,
      duplicateTitle: local?.duplicateTitle ?? api.duplicateTitle,
      universityId: early ? null : local?.universityId || api.universityId,
      universityName: early ? null : local?.universityName || api.universityName,
      industryId: local?.industryId || api.industryId,
      industryName: local?.industryName || api.industryName,
      industryStatus: local?.industryStatus || api.industryStatus,
      ownerId: api.ownerEmail ? api.ownerId : local?.ownerId || api.ownerId,
      ownerName:
        api.ownerName && api.ownerName !== "Filed on SocioNex"
          ? api.ownerName
          : local?.ownerName || api.ownerName,
      ownerEmail: api.ownerEmail || local?.ownerEmail || "",
      ownerRole: api.ownerEmail ? api.ownerRole : local?.ownerRole || api.ownerRole,
      note: local?.note && !String(local.note).startsWith("Mock classifier")
        ? local.note
        : api.note || local?.note || "",
    }
    return fillMatchHints(next, institutions)
  })
  const leftovers = [...localById.values()]
    .filter((item) => !/^\d+$/.test(String(item.id)))
    .map((item) => fillMatchHints(item, institutions))
  return [...merged, ...leftovers]
}

function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const fresh = createInitialState()
      return {
        ...fresh,
        problems: fresh.problems.map((item) => fillMatchHints(item, fresh.institutions)),
      }
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.problems) || !Array.isArray(parsed.institutions)) {
      const fresh = createInitialState()
      return {
        ...fresh,
        problems: fresh.problems.map((item) => fillMatchHints(item, fresh.institutions)),
      }
    }
    const merged = { ...createInitialState(), ...parsed }
    return {
      ...merged,
      problems: merged.problems.map((item) => fillMatchHints(item, merged.institutions)),
    }
  } catch {
    const fresh = createInitialState()
    return {
      ...fresh,
      problems: fresh.problems.map((item) => fillMatchHints(item, fresh.institutions)),
    }
  }
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [toast, setToast] = useState(null)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const refreshFromApi = async () => {
    try {
      const [rows, unis, overview, categoryStats, statusStats, leaderboard, mapData, openBoard] = await Promise.all([
        http.challenges(),
        http.universities(),
        http.overview(),
        http.categoryStats(),
        http.statusStats(),
        http.leaderboard(),
        http.mapData(),
        http.openBoard(),
      ])
      setState((current) => {
        const fromApi =
          Array.isArray(unis) && unis.length ? unis.map(enrichUniversity) : []
        const institutions = mergeInstitutions(fromApi, current.institutions)
        return {
          ...current,
          apiOnline: true,
          problems: Array.isArray(rows)
            ? mergeChallenges(rows.map(mapApiChallenge), current.problems, institutions)
            : current.problems.map((item) => fillMatchHints(item, institutions)),
          institutions,
          overview,
          categoryStats,
          statusStats,
          leaderboard,
          mapData,
          openBoard: Array.isArray(openBoard)
            ? openBoard.map((row) => fillMatchHints(mapApiChallenge(row), institutions))
            : [],
        }
      })
      return true
    } catch {
      setState((current) => ({ ...current, apiOnline: false }))
      return false
    }
  }

  useEffect(() => {
    refreshFromApi()
  }, [])

  const api = useMemo(() => {
    const flash = (message) => {
      setToast(message)
      window.clearTimeout(flash.timer)
      flash.timer = window.setTimeout(() => setToast(null), 2800)
    }

    const replaceProblem = (next, event) => {
      setState((current) => ({
        ...current,
        problems: current.problems.map((item) => (item.id === next.id ? next : item)),
        events:
          event && !current.events.some((item) => item.id === event.id)
            ? [event, ...current.events].slice(0, 30)
            : current.events,
      }))
    }

    const requireProblem = (id) => stateRef.current.problems.find((item) => item.id === id)

    return {
      ...state,
      toast,
      flash,
      refreshFromApi,
      signIn(user) {
        setState((current) => ({ ...current, user }))
      },
      signOut() {
        setState((current) => ({ ...current, user: null }))
      },
      async login({ role, email, password }) {
        const normalized = email.trim().toLowerCase()
        try {
          const data = await http.login({ email: normalized, password, role })
          const user = {
            id: `api-${data.role}-${normalized}`,
            role: data.role,
            name: data.name,
            email: data.email || normalized,
            org: data.org || "",
            token: data.token,
            universityId:
              data.role === "university" ? data.org || `api-uni-${normalized}` : undefined,
            industryId: data.role === "industry" ? data.org || `api-ind-${normalized}` : undefined,
          }
          setState((current) => {
            let institutions = current.institutions
            if (user.role === "university") {
              const campus = campusProfileFromUser(user)
              const existing = institutions.find((item) => sameCampus(item, campus))
              institutions = upsertInstitution(
                institutions,
                existing
                  ? {
                      ...campus,
                      ...existing,
                      id: existing.id || campus.id,
                      accepted: existing.accepted,
                      declined: existing.declined,
                    }
                  : { ...campus, accepted: false },
              )
            }
            return { ...current, user, institutions }
          })
          return { user }
        } catch {
          /* fall through to local accounts */
        }
        const account = stateRef.current.accounts.find(
          (item) => item.email === normalized && item.role === role,
        )
        if (account?.passwordHash) {
          if (account.passwordHash !== hashPassword(password)) {
            return { error: "That password does not match this account." }
          }
          const user = sessionUser(account)
          setState((current) => ({ ...current, user }))
          return { user }
        }
        if (account && !account.passwordHash) {
          return { error: "This account has no password yet. Create it again from Register." }
        }
        return { error: "No account matches that role, email, and password." }
      },
      async enter(partial) {
        const email = partial.email.trim().toLowerCase()
        try {
          await http.register({
            name: partial.name,
            email,
            password: partial.password,
            role: partial.role,
            org: partial.org || "",
          })
          const data = await http.login({ email, password: partial.password, role: partial.role })
          const session = {
            id: uid("u"),
            ...partial,
            email,
            token: data.token,
            name: data.name || partial.name,
            role: data.role || partial.role,
            universityId:
              partial.role === "university"
                ? partial.org || uid("inst")
                : partial.universityId,
            industryId:
              partial.role === "industry" ? partial.org || uid("co") : partial.industryId,
          }
          delete session.password
          const campus =
            session.role === "university"
              ? campusProfileFromUser(session, partial, { pendingApproval: true })
              : null
          setState((current) => ({
            ...current,
            user: session,
            accounts: current.accounts.some((account) => account.email === email && account.role === session.role)
              ? current.accounts
              : [...current.accounts, { ...session, passwordHash: hashPassword(partial.password) }],
            institutions: campus
              ? upsertInstitution(current.institutions, {
                  ...(current.institutions.find((item) => sameCampus(item, campus)) || {}),
                  ...campus,
                  accepted: false,
                  declined: false,
                })
              : current.institutions,
          }))
          return session
        } catch {
          /* local demo fallback */
        }
        const existing = stateRef.current.accounts.find(
          (account) => account.email === email && account.role === partial.role,
        )
        if (existing?.passwordHash) {
          flash("That email is already registered for this role. Sign in instead.")
          return null
        }
        const { password, ...profile } = partial
        const user = {
          id: existing?.id || uid("u"),
          ...profile,
          email,
          passwordHash: hashPassword(password),
          universityId: existing?.universityId || (partial.role === "university" ? uid("inst") : undefined),
          industryId: existing?.industryId || (partial.role === "industry" ? uid("co") : undefined),
        }
        const institution =
          !existing && partial.role === "university"
            ? {
                id: user.universityId,
                name: partial.org,
                type: partial.type || "Higher education institution",
                location: partial.location || "",
                licence: partial.licence || "",
                about: "",
                expertise: [],
                depts: [],
                faculty: [],
                accepted: false,
                declined: false,
              }
            : null
        const partner =
          !existing && partial.role === "industry"
            ? {
                id: user.industryId,
                name: partial.org,
                kind: partial.scale || "Partner",
                blurb: "Joined from the industry desk",
                place: partial.location || "Jharkhand",
                fit: "New",
              }
            : null
        const session = sessionUser(user)
        setState((current) => ({
          ...current,
          user: session,
          accounts: current.accounts.some((account) => account.id === user.id)
            ? current.accounts.map((account) => (account.id === user.id ? user : account))
            : [...current.accounts, user],
          institutions:
            institution && !current.institutions.some((item) => item.id === institution.id)
              ? [...current.institutions, institution]
              : current.institutions,
          partners:
            partner && !current.partners.some((item) => item.id === partner.id)
              ? [...current.partners, partner]
              : current.partners,
        }))
        return session
      },
      async reportProblem(input) {
        try {
          const classified = await http.createChallenge({
            title: input.title,
            description: input.description,
            location: input.location,
            district: input.district,
            file: input.file,
            ownerEmail: input.owner?.email || stateRef.current.user?.email || "",
          })
          const draft = {
            ...buildProblem(input, stateRef.current.problems, stateRef.current.institutions),
            id: String(classified.id),
            domain: classified.category,
            priority: String(classified.priority).toLowerCase(),
            note: `Mock classifier confidence ${classified.confidence}`,
            ownerId: input.owner?.id || stateRef.current.user?.id,
            ownerName: input.owner?.name || stateRef.current.user?.name,
            ownerRole: input.owner?.role || stateRef.current.user?.role || "citizen",
            ownerEmail: (input.owner?.email || stateRef.current.user?.email || "").toLowerCase(),
          }
          const rematched = buildProblem(
            { ...input, domain: classified.category },
            stateRef.current.problems,
            stateRef.current.institutions,
          )
          draft.universityId = null
          draft.universityName = null
          draft.suggestedUniversityId = rematched.suggestedUniversityId
          draft.suggestedUniversityName = classified.assigned_to || rematched.suggestedUniversityName
          draft.suggestedDepartment = rematched.suggestedDepartment
          draft.suggestedFaculty = rematched.suggestedFaculty
          draft.suggestedFacultyTitle = rematched.suggestedFacultyTitle
          Object.assign(draft, fillMatchHints(draft, stateRef.current.institutions))
          const event = {
            id: uid("e"),
            at: draft.createdAt,
            text: `${draft.ownerName} submitted “${draft.title}” in ${draft.district}. Classified as ${draft.domain}.`,
            roles: ["government"],
            userIds: [draft.ownerId],
          }
          setState((current) => ({
            ...current,
            problems: [draft, ...current.problems.filter((item) => item.id !== draft.id)],
            events: [event, ...current.events].slice(0, 30),
          }))
          flash(`Filed under ${draft.domain}`)
          await refreshFromApi()
          return draft
        } catch {
          /* local demo fallback */
        }
        const draft = buildProblem(
          input,
          stateRef.current.problems,
          stateRef.current.institutions,
        )
        const event = {
          id: uid("e"),
          at: draft.createdAt,
          text: `${draft.ownerName} submitted “${draft.title}” in ${draft.district}. Classified as ${draft.domain}.`,
          roles: ["government"],
          userIds: [draft.ownerId],
        }
        setState((current) => {
          if (current.problems.some((item) => item.id === draft.id)) return current
          return {
            ...current,
            problems: [draft, ...current.problems],
            events: [event, ...current.events].slice(0, 30),
          }
        })
        flash(`Filed under ${draft.domain}`)
        return draft
      },
      routeToUniversity(problemId, universityId) {
        const problem = requireProblem(problemId)
        const university = stateRef.current.institutions.find((item) => item.id === universityId || item.name === universityId)
        if (!problem || !university) return
        const match = matchRecommendations(problem.domain, [university], 1)[0]
        http.assignChallenge(problem.id, university.name).then(() => refreshFromApi()).catch(() => {})
        replaceProblem(
          {
            ...problem,
            status: "assigned",
            universityId: university.id,
            universityName: university.name,
            suggestedUniversityId: university.id,
            suggestedUniversityName: university.name,
            suggestedDepartment: match?.department || problem.suggestedDepartment,
            suggestedFaculty: match?.facultyName || problem.suggestedFaculty,
            suggestedFacultyTitle: match?.facultyTitle || problem.suggestedFacultyTitle,
            note: `Routed to ${university.name}${match?.department ? ` · ${match.department}` : ""}${match?.facultyName ? ` · ${match.facultyName}` : ""}.`,
          },
          {
            id: uid("e"),
            at: new Date().toISOString(),
            text: `${problem.title} was routed to ${university.name}.`,
            roles: ["university", "government"],
            userIds: [problem.ownerId],
          },
        )
        flash(`Routed to ${university.name}`)
      },
      acceptUniversityRequest(problemId) {
        const problem = requireProblem(problemId)
        if (!problem || problem.status !== "requested") return
        replaceProblem(
          { ...problem, status: "in_progress", note: "Department confirmed the campus request." },
          {
            id: uid("e"),
            at: new Date().toISOString(),
            text: `${problem.universityName} can start on “${problem.title}”.`,
            roles: ["university", "government"],
            userIds: [problem.ownerId],
          },
        )
        flash("Campus request accepted")
      },
      returnProblem(problemId, note) {
        const problem = requireProblem(problemId)
        if (!problem) return
        replaceProblem(
          {
            ...problem,
            status: "in_validation",
            universityId: null,
            universityName: null,
            industryId: null,
            industryName: null,
            industryStatus: null,
            note: note || "Sent back to validation.",
          },
          {
            id: uid("e"),
            at: new Date().toISOString(),
            text: `${problem.title} is back in the validation queue.`,
            roles: ["government", "university"],
            userIds: [problem.ownerId],
          },
        )
        flash("Returned to the queue")
      },
      rejectProblem(problemId, note) {
        const problem = requireProblem(problemId)
        if (!problem) return
        replaceProblem(
          {
            ...problem,
            status: "rejected",
            note: note || "Returned to the person who filed it.",
          },
          {
            id: uid("e"),
            at: new Date().toISOString(),
            text: `${problem.title} was returned to ${problem.ownerName}.`,
            roles: ["government"],
            userIds: [problem.ownerId],
          },
        )
        flash("Report returned")
      },
      respondAsUniversity(problemId, decision, note) {
        const problem = requireProblem(problemId)
        const user = stateRef.current.user
        const institution = stateRef.current.institutions.find(
          (item) =>
            item.id === user?.universityId
            || item.name === user?.org
            || item.name === user?.universityId,
        )
        const owns =
          problem
          && (
            problem.universityId === user?.universityId
            || problem.universityId === institution?.id
            || problem.universityName === institution?.name
            || problem.universityName === user?.org
            || problem.suggestedUniversityId === institution?.id
            || problem.suggestedUniversityName === institution?.name
            || problem.suggestedUniversityName === user?.org
            || problem.suggestedUniversityName === user?.name
          )
        if (!problem || !owns) return
        if (!institution?.accepted) {
          flash("Government must approve your campus before you can take a brief")
          return
        }
        if (decision === "accept") {
          replaceProblem(
            {
              ...problem,
              status: "in_progress",
              universityId: institution.id,
              universityName: institution.name,
              suggestedUniversityId: institution.id,
              suggestedUniversityName: institution.name,
              note: note || "Campus team accepted the brief.",
            },
            {
              id: uid("e"),
              at: new Date().toISOString(),
              text: `${institution.name} accepted “${problem.title}”.`,
              roles: ["government", "university"],
              userIds: [problem.ownerId],
            },
          )
          flash("Challenge accepted")
          return
        }
        replaceProblem(
          {
            ...problem,
            status: "in_validation",
            universityId: null,
            universityName: null,
            suggestedUniversityId: null,
            suggestedUniversityName: null,
            note: note || "Campus declined. Needs another match.",
          },
          {
            id: uid("e"),
            at: new Date().toISOString(),
            text: `A campus declined “${problem.title}”. It is back in validation.`,
            roles: ["government"],
            userIds: [problem.ownerId],
          },
        )
        flash("Challenge declined")
      },
      requestProblem(problemId) {
        const problem = requireProblem(problemId)
        const user = stateRef.current.user
        const institution = stateRef.current.institutions.find(
          (item) => item.id === user?.universityId || item.name === user?.org || item.name === user?.universityId,
        )
        if (!problem) return
        if (!institution?.accepted) {
          flash("Government must approve your campus before you can request a brief")
          return
        }
        http
          .requestBoard({ challenge_id: Number(problem.id), university: institution?.name || user?.org || "" })
          .then((result) => {
            flash(result.message || `Request sent · fit ${result.fit_score}`)
            refreshFromApi()
          })
          .catch(() => flash("Request sent to the department"))
        const campusName = institution?.name || user?.org || "Campus"
        replaceProblem(
          {
            ...problem,
            status: "requested",
            universityId: institution?.id || campusName,
            universityName: campusName,
            suggestedUniversityId: institution?.id || campusName,
            suggestedUniversityName: campusName,
            note: "Campus requested this brief.",
          },
          {
            id: uid("e"),
            at: new Date().toISOString(),
            text: `${campusName} requested “${problem.title}”.`,
            roles: ["government", "university"],
            userIds: [problem.ownerId],
          },
        )
        flash("Request sent to the department")
      },
      inviteIndustry(problemId, partnerId) {
        const problem = requireProblem(problemId)
        const partner = stateRef.current.partners.find((item) => item.id === partnerId)
        if (!problem || !partner) return
        if (!["in_progress", "collaborating"].includes(problem.status)) {
          flash("Accept a challenge before inviting a partner")
          return
        }
        replaceProblem(
          {
            ...problem,
            status: "pending_industry",
            industryId: partner.id,
            industryName: partner.name,
            industryStatus: "pending",
          },
          {
            id: uid("e"),
            at: new Date().toISOString(),
            text: `${problem.universityName} invited ${partner.name} to “${problem.title}”.`,
            roles: ["industry", "university"],
            userIds: [problem.ownerId],
          },
        )
        flash(`Invite sent to ${partner.name}`)
      },
      respondAsIndustry(problemId, decision) {
        const problem = requireProblem(problemId)
        const user = stateRef.current.user
        if (!problem || problem.industryId !== user?.industryId) return
        if (decision === "accept") {
          replaceProblem(
            { ...problem, status: "collaborating", industryStatus: "accepted" },
            {
              id: uid("e"),
              at: new Date().toISOString(),
              text: `${problem.industryName} joined “${problem.title}”.`,
              roles: ["industry", "university", "government"],
              userIds: [problem.ownerId],
            },
          )
          flash("Collaboration accepted")
          return
        }
        replaceProblem(
          {
            ...problem,
            status: "in_progress",
            industryId: null,
            industryName: null,
            industryStatus: "rejected",
          },
          {
            id: uid("e"),
            at: new Date().toISOString(),
            text: `An industry partner passed on “${problem.title}”.`,
            roles: ["university", "industry"],
            userIds: [problem.ownerId],
          },
        )
        flash("Request declined")
      },
      advance(problemId) {
        const problem = requireProblem(problemId)
        if (!problem || !["collaborating", "in_progress", "pending_industry"].includes(problem.status)) {
          return
        }
        const progress = Math.min(2, (problem.progress || 0) + 1)
        const completed = progress >= 2
        replaceProblem(
          {
            ...problem,
            progress,
            status: completed ? "completed" : "collaborating",
            note: completed ? "Marked deployed by the campus team." : "Pilot checkpoint recorded.",
            feedback: completed ? problem.feedback ?? null : problem.feedback,
          },
          {
            id: uid("e"),
            at: new Date().toISOString(),
            text: completed
              ? `${problem.title} was marked deployed.`
              : `${problem.title} reached a pilot checkpoint.`,
            roles: ["university", "government", "industry"],
            userIds: [problem.ownerId],
          },
        )
        flash(completed ? "Marked deployed — ask the citizen for feedback" : "Pilot checkpoint saved")
      },
      setChallengeStage(problemId, status) {
        const problem = requireProblem(problemId)
        if (!problem) return
        const allowed = ["in_progress", "pending_industry", "collaborating", "completed"]
        if (!allowed.includes(status)) return
        const progress =
          status === "completed" ? 2 : status === "collaborating" ? Math.max(1, problem.progress || 0) : problem.progress || 0
        replaceProblem(
          {
            ...problem,
            status,
            progress,
            note:
              status === "completed"
                ? "Marked deployed by the campus team."
                : status === "collaborating"
                  ? "Pilot stage set by the campus team."
                  : status === "pending_industry"
                    ? "Waiting on industry partnership."
                    : "Campus team marked this in progress.",
            feedback: status === "completed" ? problem.feedback ?? null : problem.feedback,
          },
          {
            id: uid("e"),
            at: new Date().toISOString(),
            text: `Campus updated “${problem.title}” to ${status.replaceAll("_", " ")}.`,
            roles: ["university", "government", "industry", "citizen"],
            userIds: [problem.ownerId],
          },
        )
        flash(`Stage updated to ${status.replaceAll("_", " ")}`)
      },
      assignCampusTeam(problemId, { department, faculty, facultyTitle }) {
        const problem = requireProblem(problemId)
        if (!problem) return
        replaceProblem({
          ...problem,
          suggestedDepartment: department || problem.suggestedDepartment,
          suggestedFaculty: faculty || problem.suggestedFaculty,
          suggestedFacultyTitle: facultyTitle || problem.suggestedFacultyTitle || "Faculty",
          note: problem.note || "Campus team assigned.",
        })
        flash("Department and faculty saved on this challenge")
      },
      submitFeedback(problemId, payload) {
        const problem = requireProblem(problemId)
        if (!problem || problem.status !== "completed") return
        const rating = Number(payload?.rating) || 0
        if (rating < 1 || rating > 5) return
        replaceProblem(
          {
            ...problem,
            feedback: {
              rating,
              comment: String(payload?.comment || "").trim(),
              at: new Date().toISOString(),
            },
          },
          {
            id: uid("e"),
            at: new Date().toISOString(),
            text: `${problem.ownerName} rated “${problem.title}” ${rating}/5.`,
            roles: ["university", "government"],
            userIds: [problem.ownerId],
          },
        )
        flash("Feedback saved")
      },
      acceptInstitution(id) {
        setState((current) => ({
          ...current,
          institutions: current.institutions.map((item) =>
            item.id === id ? { ...item, accepted: true, declined: false } : item,
          ),
        }))
        flash("Institution approved")
      },
      declineInstitution(id) {
        setState((current) => ({
          ...current,
          institutions: current.institutions.map((item) =>
            item.id === id ? { ...item, accepted: false, declined: true } : item,
          ),
        }))
        flash("Institution declined")
      },
      updateInstitution(id, patch, options = {}) {
        setState((current) => ({
          ...current,
          institutions: current.institutions.map((item) =>
            String(item.id) === String(id) || item.name === id ? { ...item, ...patch } : item,
          ),
        }))
        if (!options.quiet) flash("Campus profile saved")
      },
      ensureCampus(user) {
        if (!user || user.role !== "university") return
        const campus = campusProfileFromUser(user)
        setState((current) => {
          const existing = current.institutions.find((item) => sameCampus(item, campus))
          return {
            ...current,
            institutions: upsertInstitution(current.institutions, {
              ...campus,
              ...(existing || {}),
              id: existing?.id || campus.id,
              accepted: existing ? existing.accepted : false,
              declined: existing ? existing.declined : false,
            }),
          }
        })
      },
      addDepartment(id, name) {
        const clean = name.trim()
        if (!clean) return
        setState((current) => {
          const match =
            current.institutions.find((item) => String(item.id) === String(id) || item.name === id)
            || null
          if (!match) {
            const campus = {
              id,
              name: String(id),
              type: "Higher education institution",
              location: "",
              about: "",
              expertise: [],
              depts: [clean],
              faculty: [],
              accepted: true,
              declined: false,
            }
            return { ...current, institutions: [...current.institutions, campus] }
          }
          if (match.depts.includes(clean)) return current
          return {
            ...current,
            institutions: current.institutions.map((item) =>
              sameCampus(item, match) ? { ...item, depts: [...item.depts, clean] } : item,
            ),
          }
        })
        flash(`Added department: ${clean}`)
      },
      addFaculty(id, name) {
        const clean = name.trim()
        if (!clean) return
        setState((current) => {
          const match =
            current.institutions.find((item) => String(item.id) === String(id) || item.name === id)
            || null
          if (!match) {
            const campus = {
              id,
              name: String(id),
              type: "Higher education institution",
              location: "",
              about: "",
              expertise: [],
              depts: [],
              faculty: [{ name: clean, title: "Faculty", department: "General", focus: [] }],
              accepted: true,
              declined: false,
            }
            return { ...current, institutions: [...current.institutions, campus] }
          }
          const names = match.faculty.map((entry) => (typeof entry === "string" ? entry : entry.name))
          if (names.includes(clean)) return current
          return {
            ...current,
            institutions: current.institutions.map((item) =>
              sameCampus(item, match)
                ? {
                    ...item,
                    faculty: [
                      ...item.faculty,
                      {
                        name: clean,
                        title: "Faculty",
                        department: item.depts?.[0] || "General",
                        focus: item.expertise?.slice(0, 2) || [],
                      },
                    ],
                  }
                : item,
            ),
          }
        })
        flash(`Added faculty: ${clean}`)
      },
      reset() {
        localStorage.removeItem(KEY)
        setState(createInitialState())
        flash("Workspace reset")
      },
      slugify,
    }
  }, [state, toast])

  return (
    <StoreContext.Provider value={api}>
      {children}
      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-navy px-4 py-2 text-sm text-white shadow-xl">
          {toast}
        </div>
      ) : null}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const value = useContext(StoreContext)
  if (!value) throw new Error("useStore must be used inside StoreProvider")
  return value
}
