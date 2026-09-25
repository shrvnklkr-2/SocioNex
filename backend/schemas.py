from datetime import datetime

from pydantic import BaseModel, Field


class LoginIn(BaseModel):
    email: str
    password: str = "demo123"
    role: str | None = None
    name: str | None = None


class RegisterIn(BaseModel):
    name: str
    email: str
    password: str = "demo123"
    role: str = "community"
    org: str = ""


class LoginOut(BaseModel):
    token: str
    role: str
    name: str
    email: str = ""
    org: str = ""


class RegisterOut(BaseModel):
    message: str


class ClassifyOut(BaseModel):
    id: int
    category: str
    priority: str
    confidence: float
    assigned_to: str


class ChallengeListItem(BaseModel):
    id: int
    title: str
    category: str
    status: str
    district: str
    confidence: float
    description: str = ""
    assigned_to: str = ""
    progress: int = 0
    location: str = ""
    priority: str = "Medium"
    owner_name: str = ""
    owner_role: str = "citizen"
    owner_email: str = ""


class MilestoneOut(BaseModel):
    title: str
    status: str


class ChallengeDetailOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    priority: str
    status: str
    district: str
    location: str
    image: str
    confidence: float
    assigned_university: str
    progress: int = Field(alias="progress_percentage")
    milestones: list[MilestoneOut]
    created_at: datetime

    model_config = {"populate_by_name": True}


class UniversityMatch(BaseModel):
    name: str
    score: int
    reason: str


class OpenBoardCard(BaseModel):
    id: int
    title: str
    category: str
    district: str
    status: str
    assigned_to: str
    confidence: float


class BoardRequestIn(BaseModel):
    challenge_id: int | None = None
    university: str | None = None


class BoardRequestOut(BaseModel):
    status: str
    fit_score: int
    message: str


class OverviewOut(BaseModel):
    totalChallenges: int
    assigned: int
    inProgress: int
    completed: int
    contributors: int = 0
    districtsRepresented: int = 0


class CategoryCount(BaseModel):
    category: str
    count: int


class StatusCount(BaseModel):
    status: str
    count: int


class LeaderEntry(BaseModel):
    name: str
    score: int
    label: str


class LeaderboardOut(BaseModel):
    universities: list[LeaderEntry]
    users: list[LeaderEntry]


class MapPoint(BaseModel):
    id: int
    title: str
    district: str
    lat: float
    lng: float
