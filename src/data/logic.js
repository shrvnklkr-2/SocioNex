import { DOMAINS } from "./seed"

const RULES = [
  { domain: "Healthcare", keys: ["health", "hospital", "clinic", "ambulance", "maternal", "disease", "malaria", "patient"] },
  { domain: "Agriculture", keys: ["crop", "paddy", "farm", "nursery", "harvest", "soil", "haat", "vegetable", "irrigation"] },
  { domain: "Water resources", keys: ["water", "handpump", "well", "drought", "drinking", "stream", "borewell"] },
  { domain: "Sanitation", keys: ["toilet", "sanitation", "sewage", "drain", "latrine", "waste"] },
  { domain: "Education", keys: ["school", "class", "student", "teacher", "classroom", "anganwadi", "dropout", "girls"] },
  { domain: "Energy", keys: ["solar", "electric", "power", "lighting", "outage", "pole", "dark"] },
  { domain: "Environment", keys: ["forest", "pollution", "dust", "mining", "climate", "tree"] },
  { domain: "Urban development", keys: ["ward", "road", "street", "traffic", "municipal", "housing", "lane"] },
  { domain: "Accessibility", keys: ["disability", "ramp", "wheelchair", "access", "braille"] },
  { domain: "Rural livelihoods", keys: ["livelihood", "buyer", "lac", "wage", "market", "shg", "skill"] },
  { domain: "Public administration", keys: ["ration", "certificate", "pension", "register", "service"] },
]

const HIGH = ["no water", "dry", "outbreak", "locked", "girls", "ambulance", "flood", "children", "night", "washed"]

export function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export function hashPassword(password) {
  let hash = 5381
  const value = `socionex:${password}`
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index)
  }
  return (hash >>> 0).toString(16)
}

export function sessionUser(account) {
  const { passwordHash, ...user } = account
  const email = String(user.email || "").trim().toLowerCase()
  return {
    ...user,
    email,
    id: user.id || (email ? `api-${user.role}-${email}` : uid("u")),
  }
}

/** Same account owns a filing across demo/api login and devices. */
export function ownsProblem(user, item) {
  if (!user || !item) return false
  const email = String(user.email || "").trim().toLowerCase()
  const itemEmail = String(item.ownerEmail || "").trim().toLowerCase()
  if (email && itemEmail && email === itemEmail) return true
  if (item.ownerId && user.id && String(item.ownerId) === String(user.id)) return true
  if (email) {
    const role = user.role || "citizen"
    if (
      item.ownerId === `api-${role}-${email}`
      || item.ownerId === `demo-${role}-${email}`
    ) {
      return true
    }
  }
  if (user.name && item.ownerName && item.ownerName === user.name) return true
  return false
}

export function classifyText(text) {
  const hay = text.toLowerCase()
  const strong = [
    ["toilet", "Sanitation"],
    ["handpump", "Water resources"],
    ["ambulance", "Healthcare"],
    ["paddy", "Agriculture"],
    ["anganwadi", "Education"],
  ]
  for (const [key, domain] of strong) {
    if (hay.includes(key)) return domain
  }
  let best = { domain: "Public administration", score: 0 }
  for (const rule of RULES) {
    const score = rule.keys.reduce((n, key) => n + (hay.includes(key) ? 1 : 0), 0)
    if (score > best.score) best = { domain: rule.domain, score }
  }
  return best.domain
}

export function scorePriority(text) {
  const hay = text.toLowerCase()
  if (HIGH.some((word) => hay.includes(word))) return "high"
  if (hay.includes("suggestion") || hay.includes("beautification")) return "low"
  return "medium"
}

function tokens(value) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3),
  )
}

export function findDuplicate(title, problems) {
  const next = tokens(title)
  if (next.size === 0) return null
  let match = null
  let best = 0
  for (const problem of problems) {
    const current = tokens(problem.title)
    let shared = 0
    next.forEach((word) => {
      if (current.has(word)) shared += 1
    })
    const score = shared / Math.min(next.size, Math.max(current.size, 1))
    if (score > best) {
      best = score
      match = problem
    }
  }
  return best >= 0.6 ? match : null
}

export function facultyName(entry) {
  if (!entry) return ""
  return typeof entry === "string" ? entry : entry.name || ""
}

export function facultyLabel(entry) {
  if (!entry) return ""
  if (typeof entry === "string") return entry
  const bits = [entry.name, entry.title, entry.department].filter(Boolean)
  return bits.join(" · ")
}

export function normalizeFaculty(list = []) {
  return list.map((entry) => {
    if (typeof entry === "string") {
      return { name: entry, title: "Faculty", department: "General", focus: [] }
    }
    return {
      name: entry.name,
      title: entry.title || "Faculty",
      department: entry.department || "General",
      focus: entry.focus || [],
    }
  })
}

export function matchUniversity(domain, institutions) {
  const accepted = institutions.filter((item) => item.accepted && !item.declined)
  return [...accepted].sort((a, b) => {
    const score = (item) => (item.expertise.includes(domain) ? 1 : 0)
    return score(b) - score(a)
  })[0] || null
}

function pickDepartment(domain, institution) {
  const faculty = normalizeFaculty(institution.faculty)
  const byFocus = faculty.find((person) => person.focus.includes(domain))
  if (byFocus?.department) return byFocus.department
  const hay = domain.toLowerCase()
  const hit = (institution.depts || []).find((dept) => {
    const name = dept.toLowerCase()
    return (
      name.includes(hay.split(" ")[0]) ||
      (hay.includes("water") && name.includes("water")) ||
      (hay.includes("agric") && (name.includes("agro") || name.includes("soil"))) ||
      (hay.includes("health") && (name.includes("health") || name.includes("medicine"))) ||
      (hay.includes("urban") && (name.includes("civil") || name.includes("computer"))) ||
      (hay.includes("energy") && name.includes("electric")) ||
      (hay.includes("environ") && name.includes("environ")) ||
      (hay.includes("educ") && (name.includes("policy") || name.includes("tribal"))) ||
      (hay.includes("sanit") && (name.includes("health") || name.includes("medicine")))
    )
  })
  return hit || institution.depts?.[0] || "General studies"
}

function pickFaculty(domain, institution, department) {
  const faculty = normalizeFaculty(institution.faculty)
  const inDept = faculty.filter((person) => person.department === department)
  const pool = inDept.length ? inDept : faculty
  return (
    pool.find((person) => person.focus.includes(domain)) ||
    pool[0] ||
    null
  )
}

export function matchRecommendations(domain, institutions, limit = 4) {
  const accepted = institutions.filter((item) => item.accepted && !item.declined)
  return [...accepted]
    .map((institution) => {
      const expertiseHit = institution.expertise.includes(domain)
      const department = pickDepartment(domain, institution)
      const faculty = pickFaculty(domain, institution, department)
      const facultyHit = faculty?.focus?.includes(domain)
      let score = expertiseHit ? 78 : 52
      if (facultyHit) score += 12
      if (department && department !== "General studies") score += 6
      score = Math.min(98, score + (institution.id.length % 5))
      return {
        universityId: institution.id,
        universityName: institution.name,
        location: institution.location,
        department,
        facultyName: faculty?.name || null,
        facultyTitle: faculty?.title || null,
        score,
        reason: expertiseHit
          ? `${department} already lists ${domain}`
          : `Closest fit via ${department}`,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function buildValidationReport(problem, problems, institutions) {
  const openCount = Math.max(problems.length, 12)
  const duplicate = problem.duplicateOf
    ? problems.find((item) => item.id === problem.duplicateOf) || { title: problem.duplicateTitle }
    : findDuplicate(problem.title, problems.filter((item) => item.id !== problem.id))
  const duplicateScore = duplicate ? 61 : 96
  const priorityScore = problem.priority === "high" ? 88 : problem.priority === "low" ? 54 : 72
  const fieldScore =
    (problem.title?.length > 8 ? 25 : 10) +
    (problem.description?.length > 30 ? 35 : 15) +
    (problem.district ? 20 : 0) +
    (problem.location ? 20 : 0)
  const matches = matchRecommendations(problem.domain, institutions)
  const top = matches[0] || null
  const composite = Math.min(
    99,
    Math.round((fieldScore * 0.25 + duplicateScore * 0.2 + priorityScore * 0.25 + 92 * 0.3)),
  )
  const urgency = problem.priority === "high" ? "High" : problem.priority === "low" ? "Low" : "Medium"
  const reach = compactNumber(1800 + openCount * 120 + (problem.priority === "high" ? 900 : 200))
  const confidence = Math.min(98, 82 + Math.round(fieldScore / 10))

  return {
    challengeId: String(problem.id).startsWith("p-")
      ? `CH-${String(problem.id).replace(/\D/g, "").padStart(4, "2") || "2481"}`
      : `CH-${String(problem.id).padStart(4, "0")}`,
    steps: [
      {
        id: "completeness",
        title: "Completeness check",
        detail: fieldScore >= 90 ? "All required context fields present." : "Core fields captured; location could be sharper.",
        score: Math.min(100, fieldScore),
        tone: "ok",
      },
      {
        id: "duplicate",
        title: "Duplicate detection",
        detail: duplicate
          ? `Possible overlap with “${duplicate.title}".`
          : `No close matches found in ${240 + openCount} challenges.`,
        score: duplicateScore,
        tone: duplicate ? "warn" : "ok",
      },
      {
        id: "priority",
        title: "Priority scoring",
        detail:
          problem.priority === "high"
            ? "High civic urgency detected."
            : problem.priority === "low"
              ? "Low urgency — improvement request."
              : "Moderate civic urgency detected.",
        score: priorityScore,
        tone: "ok",
      },
      {
        id: "category",
        title: "Categorization",
        detail: problem.domain,
        score: 100,
        tone: "ok",
      },
      {
        id: "campus",
        title: "Campus matching",
        detail: top
          ? `${matches.length} campuses shortlisted · lead ${top.universityName}`
          : "No approved campus listed for this domain yet.",
        score: top?.score ?? 40,
        tone: top ? "ok" : "warn",
      },
      {
        id: "department",
        title: "Department mapping",
        detail: top?.department
          ? `${top.department} aligned to ${problem.domain}.`
          : "Department not resolved yet.",
        score: top?.department ? 94 : 35,
        tone: top?.department ? "ok" : "warn",
      },
      {
        id: "faculty",
        title: "Faculty matching",
        detail: top?.facultyName
          ? `${top.facultyName}${top.facultyTitle ? ` · ${top.facultyTitle}` : ""}`
          : "No faculty mentor shortlisted yet.",
        score: top?.facultyName ? 91 : 30,
        tone: top?.facultyName ? "ok" : "warn",
      },
    ],
    composite: {
      score: composite,
      urgency,
      reach,
      confidence,
    },
    matches,
    top,
    needsHumanReview: Boolean(duplicate) || !top,
    reviewNote: duplicate
      ? `AI surfaced a possible overlap with “${duplicate.title}". A reviewer should confirm the distinction.`
      : "Campus, department, and faculty shortlist are ready for department confirmation.",
    reviewerPrompt: duplicate
      ? "Is this a new brief, or should it merge with the earlier report?"
      : top
        ? `Route to ${top.universityName} · ${top.department}${top.facultyName ? ` · ${top.facultyName}` : ""}?`
        : "Hold in the queue until an approved campus lists this domain.",
  }
}

export function buildProblem(input, problems, institutions) {
  const text = `${input.title} ${input.description}`
  const domain = input.domain && DOMAINS.includes(input.domain) ? input.domain : classifyText(text)
  const duplicate = findDuplicate(input.title, problems)
  const matches = matchRecommendations(domain, institutions)
  const university = matches[0]
    ? institutions.find((item) => item.id === matches[0].universityId) || matchUniversity(domain, institutions)
    : matchUniversity(domain, institutions)
  const top = matches[0] || null
  return {
    id: uid("p"),
    title: input.title.trim(),
    description: input.description.trim(),
    district: input.district,
    location: input.location.trim(),
    domain,
    priority: scorePriority(text),
    status: "in_validation",
    ownerId: input.owner.id,
    ownerName: input.owner.name,
    ownerRole: input.owner.role,
    ownerEmail: String(input.owner.email || "").trim().toLowerCase(),
    universityId: null,
    universityName: null,
    suggestedUniversityId: university?.id ?? top?.universityId ?? null,
    suggestedUniversityName: university?.name ?? top?.universityName ?? null,
    suggestedDepartment: top?.department ?? null,
    suggestedFaculty: top?.facultyName ?? null,
    suggestedFacultyTitle: top?.facultyTitle ?? null,
    industryId: null,
    industryName: null,
    industryStatus: null,
    duplicateOf: duplicate?.id ?? null,
    duplicateTitle: duplicate?.title ?? null,
    files: input.files,
    progress: 0,
    note: "",
    feedback: null,
    createdAt: new Date().toISOString(),
  }
}

export const STATUS_LABEL = {
  submitted: "Pending validation",
  in_validation: "In validation",
  requested: "University requested",
  assigned: "Awaiting university",
  in_progress: "In progress",
  pending_industry: "Industry review",
  collaborating: "Collaborating",
  completed: "Completed",
  rejected: "Returned",
}

export function solverLine(problem) {
  if (problem.status === "rejected") return "Returned to the citizen with a note"

  const campus = problem.universityName
  const industry = problem.industryName
  const dept = problem.suggestedDepartment
  const faculty = problem.suggestedFaculty

  if (campus && industry) {
    return [campus, dept, industry].filter(Boolean).join(" · ")
  }
  if (campus) {
    if (problem.status === "assigned") {
      return ["Awaiting acceptance", campus, dept, faculty].filter(Boolean).join(" · ")
    }
    return [campus, dept, faculty].filter(Boolean).join(" · ")
  }
  if (problem.suggestedUniversityName) {
    const lead =
      problem.status === "in_validation" || problem.status === "submitted"
        ? "Suggested"
        : "Matched"
    return [
      `${lead}: ${problem.suggestedUniversityName}`,
      dept,
      faculty,
    ]
      .filter(Boolean)
      .join(" · ")
  }
  return "Not assigned yet"
}

export function outcomeLabel(problem) {
  if (problem.status === "completed") {
    if (problem.feedback?.rating) return `Completed · rated ${problem.feedback.rating}/5`
    return "Completed"
  }
  if (problem.status === "rejected") return "Returned"
  if (problem.status === "assigned") return "Awaiting campus"
  if (problem.status === "in_validation" || problem.status === "submitted") return "In review"
  return "Pending"
}

export function milestonesFor(problem) {
  const labels = [
    "Submitted",
    "Validated",
    "Awaiting campus",
    "Team formed",
    "Industry partner",
    "Pilot",
    "Deployed",
  ]
  const reached = {
    submitted: 0,
    in_validation: 0,
    rejected: 0,
    requested: 1,
    assigned: 2,
    in_progress: 3,
    pending_industry: 3,
    collaborating: 4,
    completed: 6,
  }[problem.status] ?? 0
  const extra = problem.status === "collaborating" ? problem.progress : 0
  const doneUntil = problem.status === "completed" ? 6 : Math.min(6, reached + extra)
  return labels.map((label, index) => ({ label, done: index <= doneUntil }))
}

export function pathForRole(role) {
  if (role === "citizen" || role === "community") return "/citizen"
  if (role === "university") return "/university"
  if (role === "industry") return "/industry"
  if (role === "government") return "/government"
  return "/"
}

export function helloName(user) {
  if (!user) return ""
  if (user.role !== "citizen" && user.role !== "university") return user.name
  return user.name.replace(/^Dr\.\s*/i, "").split(" ")[0]
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function compactNumber(value) {
  if (value >= 1000) {
    const scaled = value / 1000
    return `${scaled.toFixed(1)}k`
  }
  return String(value)
}

export function liveStats(problems) {
  const list = problems || []
  return {
    submitted: list.length,
    assigned: list.filter((item) => item.status === "assigned").length,
    inProgress: list.filter((item) =>
      ["in_progress", "collaborating", "pending_industry"].includes(item.status),
    ).length,
    completed: list.filter((item) => item.status === "completed").length,
  }
}

export function momentumFromProblems(problems, months = 6) {
  const list = problems || []
  const now = new Date()
  const buckets = []
  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    buckets.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("en", { month: "short" }),
      submitted: 0,
      resolved: 0,
    })
  }
  for (const problem of list) {
    const created = new Date(problem.createdAt || Date.now())
    if (Number.isNaN(created.getTime())) continue
    const key = `${created.getFullYear()}-${created.getMonth()}`
    const bucket = buckets.find((item) => item.key === key)
    if (!bucket) continue
    bucket.submitted += 1
    if (problem.status === "completed") bucket.resolved += 1
  }
  return buckets
}

export function networkFromProblems(problems, overview) {
  const list = problems || []
  const owners = new Set(
    list
      .map((item) => item.ownerEmail || item.ownerId || item.ownerName)
      .filter(Boolean),
  )
  const districts = new Set(list.map((item) => item.district).filter(Boolean))
  return {
    contributors: overview?.contributors ?? owners.size,
    districts: overview?.districtsRepresented ?? districts.size,
  }
}

export function districtSnapshot(problems) {
  const byDistrict = new Map()
  for (const problem of problems || []) {
    const name = problem.district || "Unknown"
    const row = byDistrict.get(name) || { district: name, open: 0, pilot: 0, closed: 0 }
    if (problem.status === "completed") row.closed += 1
    else if (["in_progress", "collaborating", "pending_industry", "assigned"].includes(problem.status)) {
      row.pilot += 1
    } else row.open += 1
    byDistrict.set(name, row)
  }
  return [...byDistrict.values()].sort((a, b) => b.open + b.pilot + b.closed - (a.open + a.pilot + a.closed))
}

export function domainPressure(problems) {
  const counts = {}
  for (const problem of problems || []) {
    if (!problem.domain) continue
    counts[problem.domain] = (counts[problem.domain] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
}

export function visibleEvents(user, events) {
  if (!user) return []
  return events.filter(
    (event) => event.userIds?.includes(user.id) || event.roles?.includes(user.role),
  )
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32)
}
