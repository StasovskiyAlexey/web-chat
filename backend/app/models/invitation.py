from datetime import datetime

import nanoid
from ..core.db import Base

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import DateTime, Enum, ForeignKey, func

class Invitation(Base):
  __tablename__ = 'invitations'
  
  id: Mapped[str] = mapped_column(primary_key=True, index=True, default=lambda: str(nanoid.generate(size=10)))
  inviter_id: Mapped[str] = mapped_column(ForeignKey('users.id'))
  
  user_id: Mapped[str] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
  room_id: Mapped[str] = mapped_column(ForeignKey('rooms.id', ondelete='CASCADE'))
  
  status: Mapped[str] = mapped_column(Enum("pending", "accepted", 'canceled', name='invitation_status'), default='pending')
  created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)