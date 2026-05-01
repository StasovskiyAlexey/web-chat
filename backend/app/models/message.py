from datetime import datetime

import nanoid
from sqlalchemy import DateTime, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.db import Base

class Message(Base):
  __tablename__ = 'messages'
  
  id: Mapped[str] = mapped_column(primary_key=True, index=True, default=lambda: str(nanoid.generate(size=10)))
  content: Mapped[str] = mapped_column(nullable=False)
  
  room_id: Mapped[str] = mapped_column(ForeignKey('rooms.id', ondelete='CASCADE'))
  user_id: Mapped[str] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
  
  room: Mapped['Room'] = relationship(back_populates='messages')
  user: Mapped['User'] = relationship(back_populates='messages')
  
  member_id: Mapped[str] = mapped_column(ForeignKey('members.id', ondelete='CASCADE'))
  member: Mapped['Member'] = relationship(back_populates='messages')
  
  created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
  is_read: Mapped[bool] = mapped_column(default=False)
  
  # Индекс для быстрой выборки истории чата
  __table_args__ = (
    Index('ix_room_messages_order', 'room_id', 'created_at'),
  )