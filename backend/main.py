from contextlib import asynccontextmanager
from pathlib import Path
import os
import random

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, SessionLocal, engine, get_db
from models import BoardRequest, Challenge, Milestone, University, User
from schemas import (
    BoardRequestIn,
    BoardRequestOut,
    CategoryCount,
    ChallengeListItem,
    ClassifyOut,
    LeaderboardOut,
    LeaderEntry,
    LoginIn,
    LoginOut,
    MapPoint,
    MilestoneOut,
    OpenBoardCard,
    OverviewOut,
    RegisterIn,
    RegisterOut,
    StatusCount,
    UniversityMatch,
)
CATEGORIES = [
    "Education",
    "Healthcare",
    "Agriculture",
    "Water resources",
    "Environment",
    "Energy",
    "Urban development",
    "Accessibility",
    "Public administration",
    "Rural livelihoods",
    "Sanitation",
]
PRIORITIES = ["High", "Medium", "Low"]
ASSIGN_POOL = ["IIT Bombay", "VJTI", "Birsa Agricultural University", "NIT Jamshedpur", "RIMS Ranchi"]

Base.metadata.create_all(bind=engine)
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    db = SessionLocal()
    try:
        defaults = [
            {
                "name": "Jharkhand Innovation Cell",
                "email": "gov@jharkhand.gov.in",
                "password": "demo123",
                "role": "government",
                "org": "Government of Jharkhand",
            },
            {
                "name": "Rakesh Mahato",
                "email": "rakesh.mahato@example.com",
                "password": "demo123",
                "role": "citizen",
                "org": "",
            },
            {
                "name": "BIT Mesra Innovation Cell",
                "email": "coordinator@bitmesra-innovation.example.edu",
                "password": "demo123",
                "role": "university",
                "org": "BIT Mesra",
            },
            {
                "name": "Mahindra Rise Partnerships",
                "email": "partnerships@mahindrarise.example.com",
                "password": "demo123",
                "role": "industry",
                "org": "Mahindra Rise",
            },
            {
                "name": "Gram Vikas Samiti",
                "email": "hello@gramvikas.example",
                "password": "demo123",
                "role": "community",
                "org": "Gram Vikas Samiti",
            },
        ]
        for row in defaults:
            existing = db.query(User).filter(User.email == row["email"], User.role == row["role"]).first()
            if existing:
                existing.password = row["password"]
                existing.name = row["name"]
                existing.org = row["org"]
            else:
                db.add(User(**row))
            if row["role"] == "university":
                uni = db.query(University).filter(University.name == row["org"]).first()
                if not uni and row["org"]:
                    db.add(
                        University(
                            name=row["org"],
                            location="Ranchi",
                            expertise="Engineering, Innovation",
                            reason="Default campus account",
                            score=88,
                        )
                    )
        db.commit()
    finally:
        db.close()
    yield


app = FastAPI(title="SocioNex mock API", version="0.1.0", lifespan=lifespan)

_frontend = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
]
if _frontend:
    _origins.append(_frontend)
_origins.extend(
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def fake_classify(title: str, description: str, location: str):
    text = f"{title} {description} {location}".lower()
    mapping = [
        ("toilet", "Sanitation"),
        ("school", "Education"),
        ("handpump", "Water resources"),
        ("water", "Water resources"),
        ("farm", "Agriculture"),
        ("paddy", "Agriculture"),
        ("hospital", "Healthcare"),
        ("ambulance", "Healthcare"),
        ("dust", "Environment"),
        ("forest", "Environment"),
        ("solar", "Energy"),
        ("street", "Urban development"),
        ("ramp", "Accessibility"),
        ("ration", "Public administration"),
        ("weaver", "Rural livelihoods"),
        ("lac", "Rural livelihoods"),
    ]
    category = next((label for key, label in mapping if key in text), random.choice(CATEGORIES))
    priority = "High" if any(word in text for word in ["locked", "night", "dry", "ambulance", "girls"]) else random.choice(PRIORITIES)
    return category, priority, round(random.uniform(0.78, 0.96), 2), random.choice(ASSIGN_POOL)


def user_from_login(db: Session, payload: LoginIn) -> User | None:
    email = payload.email.strip().lower()
    query = db.query(User).filter(User.email == email)
    if payload.role:
        query = query.filter(User.role == payload.role)
    user = query.first()
    if user and user.password == payload.password:
        return user
    if not user:
        user = db.query(User).filter(User.email == email).first()
        if user and user.password == payload.password:
            return user
    return None


@app.get("/")
def root():
    return {"service": "SocioNex mock API", "docs": "/docs"}


@app.post("/login", response_model=LoginOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = user_from_login(db, payload)
    if user:
        return LoginOut(token="demo-token", role=user.role, name=user.name, email=user.email, org=user.org)
    known = db.query(User).filter(User.email == payload.email.strip().lower()).first()
    if known:
        raise HTTPException(status_code=401, detail="Invalid password")
    return LoginOut(
        token="demo-token",
        role=payload.role or "community",
        name=payload.name or "John Doe",
        email=payload.email.strip().lower(),
        org="",
    )


@app.post("/register", response_model=RegisterOut)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    existing = db.query(User).filter(User.email == email, User.role == payload.role).first()
    if existing:
        return RegisterOut(message="Account already exists. You can sign in.")
    db.add(
        User(
            name=payload.name.strip(),
            email=email,
            password=payload.password or "demo123",
            role=payload.role,
            org=payload.org,
        )
    )
    if payload.role == "university" and payload.org.strip():
        uni = db.query(University).filter(University.name == payload.org.strip()).first()
        if not uni:
            db.add(
                University(
                    name=payload.org.strip(),
                    location="",
                    expertise="",
                    reason="Registered campus on SocioNex",
                    score=80,
                )
            )
    db.commit()
    return RegisterOut(message="Registration successful")


@app.post("/challenges", response_model=ClassifyOut)
def create_challenge(
    title: str = Form(...),
    description: str = Form(""),
    location: str = Form(""),
    district: str = Form(""),
    owner_email: str = Form(""),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    category, priority, confidence, assigned_to = fake_classify(title, description, location)
    filename = ""
    if image and image.filename:
        filename = image.filename
        target = UPLOAD_DIR / filename
        target.write_bytes(image.file.read())
    district_name = district or (location.split(",")[-1].strip() if location else "Ranchi")
    owner = None
    email_key = owner_email.strip().lower()
    if email_key:
        owner = db.query(User).filter(User.email == email_key).first()
        # If the account exists under a slightly different casing or was just seeded,
        # still attach so My Submissions works on every device.
        if not owner:
            owner = (
                db.query(User)
                .filter(User.email.ilike(email_key))
                .first()
            )
    challenge = Challenge(
        title=title.strip(),
        description=description.strip(),
        location=location.strip(),
        district=district_name,
        image=filename,
        category=category,
        priority=priority,
        confidence=confidence,
        assigned_to=assigned_to,
        status="in_validation",
        progress=0,
        owner_id=owner.id if owner else None,
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    for index, (step, status) in enumerate(
        [("Submitted", "Completed"), ("Site Visit", "Pending"), ("Prototype Design", "Pending"), ("Pilot", "Pending")]
    ):
        db.add(Milestone(challenge_id=challenge.id, title=step, status=status, sort_order=index))
    db.commit()
    return ClassifyOut(
        id=challenge.id,
        category=category,
        priority=priority,
        confidence=confidence,
        assigned_to=assigned_to,
    )


@app.get("/challenges", response_model=list[ChallengeListItem])
def list_challenges(db: Session = Depends(get_db)):
    rows = db.query(Challenge).order_by(Challenge.id).all()
    return [
        ChallengeListItem(
            id=row.id,
            title=row.title,
            category=row.category,
            status=row.status,
            district=row.district,
            confidence=row.confidence,
            description=row.description,
            assigned_to=row.assigned_to,
            progress=row.progress,
            location=row.location,
            priority=row.priority,
            owner_name=row.owner.name if row.owner else "Filed on SocioNex",
            owner_role=row.owner.role if row.owner else "citizen",
            owner_email=row.owner.email if row.owner else "",
        )
        for row in rows
    ]


@app.get("/challenges/{challenge_id}")
def challenge_details(challenge_id: int, db: Session = Depends(get_db)):
    row = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Challenge not found")
    milestones = (
        db.query(Milestone)
        .filter(Milestone.challenge_id == row.id)
        .order_by(Milestone.sort_order)
        .all()
    )
    return {
        "id": row.id,
        "title": row.title,
        "description": row.description,
        "category": row.category,
        "priority": row.priority,
        "status": row.status,
        "district": row.district,
        "location": row.location,
        "image": row.image,
        "confidence": row.confidence,
        "assigned_university": row.assigned_to,
        "progress_percentage": row.progress,
        "milestones": [{"title": item.title, "status": item.status} for item in milestones],
    }


@app.get("/universities")
def list_universities(db: Session = Depends(get_db)):
    rows = db.query(University).order_by(University.score.desc()).all()
    return [
        {
            "id": row.id,
            "name": row.name,
            "location": row.location,
            "expertise": row.expertise,
            "reason": row.reason,
            "score": row.score,
        }
        for row in rows
    ]


@app.post("/challenges/{challenge_id}/assign")
def assign_challenge(challenge_id: int, payload: dict, db: Session = Depends(get_db)):
    row = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Challenge not found")
    row.assigned_to = payload.get("university") or row.assigned_to
    row.status = "assigned"
    db.commit()
    return {"id": row.id, "assigned_to": row.assigned_to, "status": row.status}


@app.get("/universities/matches/{challenge_id}", response_model=list[UniversityMatch])
def university_matches(challenge_id: int, db: Session = Depends(get_db)):
    _ = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    return [
        UniversityMatch(name="IIT Bombay", score=95, reason="Strong environmental engineering department"),
        UniversityMatch(name="VJTI", score=89, reason="Urban infrastructure expertise"),
    ]


@app.get("/open-board", response_model=list[OpenBoardCard])
def open_board(db: Session = Depends(get_db)):
    rows = (
        db.query(Challenge)
        .filter(Challenge.status.in_(["in_validation", "assigned"]))
        .order_by(Challenge.id)
        .all()
    )
    return [
        OpenBoardCard(
            id=row.id,
            title=row.title,
            category=row.category,
            district=row.district,
            status=row.status,
            assigned_to=row.assigned_to,
            confidence=row.confidence,
        )
        for row in rows
    ]


@app.post("/open-board/request", response_model=BoardRequestOut)
def open_board_request(payload: BoardRequestIn, db: Session = Depends(get_db)):
    row = BoardRequest(
        challenge_id=payload.challenge_id,
        university=payload.university or "",
        status="pending",
        fit_score=88,
        message="Request submitted successfully",
    )
    db.add(row)
    db.commit()
    return BoardRequestOut(status="pending", fit_score=88, message="Request submitted successfully")


@app.get("/dashboard/overview", response_model=OverviewOut)
def dashboard_overview(db: Session = Depends(get_db)):
    total = db.query(Challenge).count()
    assigned = db.query(Challenge).filter(Challenge.status == "assigned").count()
    in_progress = (
        db.query(Challenge)
        .filter(Challenge.status.in_(("in_progress", "collaborating", "pending_industry")))
        .count()
    )
    completed = db.query(Challenge).filter(Challenge.status == "completed").count()
    contributors = db.query(User).count()
    districts = db.query(Challenge.district).distinct().count()
    return OverviewOut(
        totalChallenges=total,
        assigned=assigned,
        inProgress=in_progress,
        completed=completed,
        contributors=contributors,
        districtsRepresented=districts,
    )


@app.get("/dashboard/category-stats", response_model=list[CategoryCount])
def category_stats(db: Session = Depends(get_db)):
    rows = db.query(Challenge).all()
    counts: dict[str, int] = {}
    for row in rows:
        counts[row.category] = counts.get(row.category, 0) + 1
    return [CategoryCount(category=key, count=value) for key, value in sorted(counts.items(), key=lambda item: -item[1])]


@app.get("/dashboard/status-stats", response_model=list[StatusCount])
def status_stats(db: Session = Depends(get_db)):
    rows = db.query(Challenge).all()
    counts: dict[str, int] = {}
    for row in rows:
        counts[row.status] = counts.get(row.status, 0) + 1
    return [StatusCount(status=key, count=value) for key, value in counts.items()]


@app.get("/dashboard/leaderboard", response_model=LeaderboardOut)
def leaderboard(db: Session = Depends(get_db)):
    unis = db.query(University).order_by(University.score.desc()).limit(5).all()
    people = db.query(User).limit(5).all()
    uni_scores = []
    for item in unis:
        assigned = (
            db.query(Challenge)
            .filter(Challenge.assigned_to == item.name)
            .count()
        )
        uni_scores.append(LeaderEntry(name=item.name, score=assigned, label=item.location))
    user_scores = []
    for item in people:
        filed = db.query(Challenge).filter(Challenge.owner_id == item.id).count()
        user_scores.append(LeaderEntry(name=item.name, score=filed, label=item.role))
    return LeaderboardOut(universities=uni_scores, users=user_scores)


@app.get("/dashboard/map-data", response_model=list[MapPoint])
def map_data(db: Session = Depends(get_db)):
    rows = db.query(Challenge).order_by(Challenge.id).all()
    points = []
    rng = random.Random(21)
    for row in rows:
        points.append(
            MapPoint(
                id=row.id,
                title=row.title,
                district=row.district,
                lat=round(22.4 + rng.random() * 2.2, 4),
                lng=round(83.5 + rng.random() * 3.6, 4),
            )
        )
    return points


@app.get("/milestones/{challenge_id}", response_model=list[MilestoneOut])
def milestones(challenge_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(Milestone)
        .filter(Milestone.challenge_id == challenge_id)
        .order_by(Milestone.sort_order)
        .all()
    )
    if rows:
        return [MilestoneOut(title=row.title, status=row.status) for row in rows]
    return [
        MilestoneOut(title="Site Visit", status="Completed"),
        MilestoneOut(title="Prototype Design", status="In Progress"),
    ]
