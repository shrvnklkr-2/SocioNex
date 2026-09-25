const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "/api" : "http://127.0.0.1:8001")

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail || `API ${response.status}`)
  }
  const text = await response.text()
  return text ? JSON.parse(text) : {}
}

export const api = {
  login(payload) {
    return request("/login", { method: "POST", body: JSON.stringify(payload) })
  },
  register(payload) {
    return request("/register", { method: "POST", body: JSON.stringify(payload) })
  },
  challenges() {
    return request("/challenges")
  },
  challenge(id) {
    return request(`/challenges/${id}`)
  },
  createChallenge({ title, description, location, district, file, ownerEmail }) {
    const body = new FormData()
    body.append("title", title)
    body.append("description", description || "")
    body.append("location", location || "")
    body.append("district", district || "")
    if (ownerEmail) body.append("owner_email", ownerEmail)
    if (file) body.append("image", file)
    return request("/challenges", { method: "POST", body })
  },
  assignChallenge(id, university) {
    return request(`/challenges/${id}/assign`, { method: "POST", body: JSON.stringify({ university }) })
  },
  universities() {
    return request("/universities")
  },
  universityMatches(id) {
    return request(`/universities/matches/${id}`)
  },
  openBoard() {
    return request("/open-board")
  },
  requestBoard(payload) {
    return request("/open-board/request", { method: "POST", body: JSON.stringify(payload) })
  },
  overview() {
    return request("/dashboard/overview")
  },
  categoryStats() {
    return request("/dashboard/category-stats")
  },
  statusStats() {
    return request("/dashboard/status-stats")
  },
  leaderboard() {
    return request("/dashboard/leaderboard")
  },
  mapData() {
    return request("/dashboard/map-data")
  },
  milestones(id) {
    return request(`/milestones/${id}`)
  },
}

export function mapApiChallenge(row) {
  const assigned = row.assigned_university || row.assigned_to || null
  const status = row.status || "in_validation"
  const early = ["submitted", "in_validation", "rejected"].includes(status)
  const email = String(row.owner_email || "").trim().toLowerCase()
  const role = row.owner_role || "citizen"
  return {
    id: String(row.id),
    title: row.title,
    description: row.description || "",
    district: row.district,
    location: row.location || row.district,
    domain: row.category,
    priority: String(row.priority || "medium").toLowerCase(),
    status,
    ownerId: email ? `api-${role}-${email}` : `api-${role}`,
    ownerName: row.owner_name || "Filed on SocioNex",
    ownerRole: role,
    ownerEmail: email,
    universityId: early ? null : assigned,
    universityName: early ? null : assigned,
    suggestedUniversityId: assigned,
    suggestedUniversityName: assigned,
    suggestedDepartment: null,
    suggestedFaculty: null,
    suggestedFacultyTitle: null,
    industryId: null,
    industryName: null,
    industryStatus: null,
    duplicateOf: null,
    duplicateTitle: null,
    files: row.image ? [row.image] : [],
    progress: row.progress_percentage ?? row.progress ?? 0,
    confidence: row.confidence,
    note: row.confidence ? `Mock classifier confidence ${row.confidence}` : "",
    feedback: null,
    createdAt: row.created_at || new Date().toISOString(),
  }
}

export function mapApiUniversity(row) {
  return {
    id: String(row.id),
    name: row.name,
    type: "Higher education institution",
    location: row.location || "",
    licence: "",
    about: row.reason || "",
    expertise: String(row.expertise || "").split(",").map((item) => item.trim()).filter(Boolean),
    depts: [],
    faculty: [],
    accepted: true,
    declined: false,
    score: row.score,
  }
}
