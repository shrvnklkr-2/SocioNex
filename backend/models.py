from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    password: Mapped[str] = mapped_column(String(80), default="demo123")
    role: Mapped[str] = mapped_column(String(40))
    org: Mapped[str] = mapped_column(String(160), default="")

    challenges: Mapped[list["Challenge"]] = relationship(back_populates="owner")


class University(Base):
    __tablename__ = "universities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(160), unique=True)
    location: Mapped[str] = mapped_column(String(80), default="")
    expertise: Mapped[str] = mapped_column(String(240), default="")
    reason: Mapped[str] = mapped_column(String(240), default="")
    score: Mapped[int] = mapped_column(Integer, default=80)


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(160), unique=True)
    kind: Mapped[str] = mapped_column(String(80), default="Partner")
    place: Mapped[str] = mapped_column(String(80), default="")


class Challenge(Base):
    __tablename__ = "challenges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(220))
    description: Mapped[str] = mapped_column(Text, default="")
    category: Mapped[str] = mapped_column(String(80), default="Environment")
    priority: Mapped[str] = mapped_column(String(20), default="Medium")
    status: Mapped[str] = mapped_column(String(40), default="in_validation")
    district: Mapped[str] = mapped_column(String(80), default="Ranchi")
    location: Mapped[str] = mapped_column(String(160), default="")
    image: Mapped[str] = mapped_column(String(220), default="")
    confidence: Mapped[float] = mapped_column(Float, default=0.86)
    assigned_to: Mapped[str] = mapped_column(String(160), default="")
    progress: Mapped[int] = mapped_column(Integer, default=0)
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    owner: Mapped[User | None] = relationship(back_populates="challenges")
    milestones: Mapped[list["Milestone"]] = relationship(
        back_populates="challenge",
        cascade="all, delete-orphan",
    )


class Milestone(Base):
    __tablename__ = "milestones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    challenge_id: Mapped[int] = mapped_column(ForeignKey("challenges.id"))
    title: Mapped[str] = mapped_column(String(160))
    status: Mapped[str] = mapped_column(String(40), default="Pending")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    challenge: Mapped[Challenge] = relationship(back_populates="milestones")


class BoardRequest(Base):
    __tablename__ = "board_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    challenge_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    university: Mapped[str] = mapped_column(String(160), default="")
    status: Mapped[str] = mapped_column(String(40), default="pending")
    fit_score: Mapped[int] = mapped_column(Integer, default=88)
    message: Mapped[str] = mapped_column(String(220), default="Request submitted successfully")
