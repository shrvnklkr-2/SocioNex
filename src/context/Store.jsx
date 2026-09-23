import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { buildProblem, hashPassword, sessionUser, slugify, uid } from "../data/logic"
import { createInitialState, DEMO_PASSWORD, DEMO_USERS } from "../data/seed"

const KEY = "socionex-workspace-v1"
const StoreContext = createContext(null)

function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return createInitialState()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.problems) || !Array.isArray(parsed.institutions)) {
      return createInitialState()
    }
    return { ...createInitialState(), ...parsed }
  } catch {
    return createInitialState()
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
      signIn(user) {
        setState((current) => ({ ...current, user }))
      },
      signOut() {
        setState((current) => ({ ...current, user: null }))
      },
      login({ role, email, password }) {
        const normalized = email.trim().toLowerCase()
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
        const demo = Object.values(DEMO_USERS).find(
          (item) => item.role === role && item.email.toLowerCase() === normalized,
        )
        if (demo && password === DEMO_PASSWORD) {
          setState((current) => ({ ...current, user: demo }))
          return { user: demo }
        }
        return { error: "No account matches that role, email, and password." }
      },
      enter(partial) {
        const email = partial.email.trim().toLowerCase()
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
      reportProblem(input) {
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
        const university = stateRef.current.institutions.find((item) => item.id === universityId)
        if (!problem || !university?.accepted) return
        replaceProblem(
          {
            ...problem,
            status: "assigned",
            universityId: university.id,
            universityName: university.name,
            note: "Routed by the department.",
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
        if (!problem || problem.universityId !== user?.universityId) return
        if (decision === "accept") {
          replaceProblem(
            { ...problem, status: "in_progress", note: note || "Campus team accepted the brief." },
            {
              id: uid("e"),
              at: new Date().toISOString(),
              text: `${problem.universityName} accepted “${problem.title}”.`,
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
        const institution = stateRef.current.institutions.find((item) => item.id === user?.universityId)
        if (!problem || !institution?.accepted) {
          flash("The department still has to approve this campus")
          return
        }
        if (problem.universityId) {
          flash("Another campus is already on this brief")
          return
        }
        replaceProblem(
          {
            ...problem,
            status: "requested",
            universityId: institution.id,
            universityName: institution.name,
            note: "Campus requested this brief.",
          },
          {
            id: uid("e"),
            at: new Date().toISOString(),
            text: `${institution.name} requested “${problem.title}”.`,
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
        if (!problem || !["collaborating", "in_progress"].includes(problem.status)) return
        const progress = Math.min(2, (problem.progress || 0) + 1)
        const completed = progress >= 2
        replaceProblem(
          {
            ...problem,
            progress,
            status: completed ? "completed" : "collaborating",
            note: completed ? "Marked deployed by the campus team." : "Pilot checkpoint recorded.",
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
        flash(completed ? "Marked deployed" : "Pilot checkpoint saved")
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
          institutions: current.institutions.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        }))
        if (!options.quiet) flash("Campus profile saved")
      },
      addDepartment(id, name) {
        const clean = name.trim()
        if (!clean) return
        setState((current) => ({
          ...current,
          institutions: current.institutions.map((item) =>
            item.id === id && !item.depts.includes(clean) ? { ...item, depts: [...item.depts, clean] } : item,
          ),
        }))
      },
      addFaculty(id, name) {
        const clean = name.trim()
        if (!clean) return
        setState((current) => ({
          ...current,
          institutions: current.institutions.map((item) =>
            item.id === id && !item.faculty.includes(clean)
              ? { ...item, faculty: [...item.faculty, clean] }
              : item,
          ),
        }))
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
