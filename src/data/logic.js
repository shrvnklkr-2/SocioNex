import { DOMAINS, DOMAIN_BASE } from "./seed"

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
  return user
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

export function matchUniversity(domain, institutions) {
  const accepted = institutions.filter((item) => item.accepted && !item.declined)
  return [...accepted].sort((a, b) => {
    const score = (item) => (item.expertise.includes(domain) ? 1 : 0)
    return score(b) - score(a)
  })[0] || null
}

export function buildProblem(input, problems, institutions) {
  const text = `${input.title} ${input.description}`
  const domain = input.domain && DOMAINS.includes(input.domain) ? input.domain : classifyText(text)
  const duplicate = findDuplicate(input.title, problems)
  const university = matchUniversity(domain, institutions)
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
    universityId: null,
    universityName: null,
    suggestedUniversityId: university?.id ?? null,
    suggestedUniversityName: university?.name ?? null,
    industryId: null,
    industryName: null,
    industryStatus: null,
    duplicateOf: duplicate?.id ?? null,
    duplicateTitle: duplicate?.title ?? null,
    files: input.files,
    progress: 0,
    note: "",
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
  if (problem.universityName && problem.industryName) {
    return `${problem.universityName} · ${problem.industryName}`
  }
  if (problem.universityName) return problem.universityName
  if (problem.suggestedUniversityName && !problem.universityName) {
    return "Not assigned yet"
  }
  return "Not assigned yet"
}

export function outcomeLabel(problem) {
  return problem.status === "completed" ? "Completed" : "Pending"
}

export function milestonesFor(problem) {
  const labels = [
    "Submitted",
    "Validated",
    "University assigned",
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
  const validation = problems.filter((item) =>
    ["submitted", "in_validation", "requested"].includes(item.status),
  ).length
  const active = problems.filter((item) =>
    ["assigned", "in_progress", "pending_industry", "collaborating"].includes(item.status),
  ).length
  const done = problems.filter((item) => item.status === "completed").length
  return {
    submitted: 240 + problems.length,
    validation: 34 + validation,
    active: 79 + active,
    impacted: 18000 + done * 200 + problems.length * 25,
  }
}

export function domainPressure(problems) {
  const counts = Object.fromEntries(DOMAINS.map((domain) => [domain, DOMAIN_BASE[domain] ?? 0]))
  for (const problem of problems) {
    counts[problem.domain] = (counts[problem.domain] ?? 0) + 1
  }
  return DOMAINS.map((domain) => ({ domain, count: counts[domain] })).sort((a, b) => b.count - a.count)
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
