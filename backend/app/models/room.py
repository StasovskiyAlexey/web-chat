from datetime import datetime
from typing import List

import nanoid
from sqlalchemy import DateTime, Enum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.db import Base

class Room(Base):
  __tablename__ = 'rooms'
  
  id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(nanoid.generate(size=10)))
  name: Mapped[str] = mapped_column(nullable=False)
  
  members: Mapped[List['Member']] = relationship(back_populates='room', cascade="all, delete-orphan")
  messages: Mapped[List['Message']] = relationship(back_populates='room', cascade="all, delete-orphan")
  
  type: Mapped[str] = mapped_column(Enum('direct', 'group', name='direct'), default='room_type')
  created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)