from datetime import datetime
from typing import List

import nanoid
from sqlalchemy import DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import relationship

from ..core.db import Base
from sqlalchemy.orm import Mapped, mapped_column

class Member(Base):
  __tablename__ = 'members'
  
  id: Mapped[str] = mapped_column(primary_key=True, index=True, default=lambda: str(nanoid.generate(size=10)))
  
  # Реальные колонки в БД
  user_id: Mapped[str] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
  room_id: Mapped[str] = mapped_column(ForeignKey('rooms.id', ondelete='CASCADE'))
  
  # Удобство для связи с обьектами
  user: Mapped['User'] = relationship(back_populates='membership')
  room: Mapped['Room'] = relationship(back_populates='members')
  
  messages: Mapped[List['Message']] = relationship(back_populates='member')
  
  joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
  role: Mapped[datetime] = mapped_column(Enum('owner', 'member', name='owner'), default='member_role')