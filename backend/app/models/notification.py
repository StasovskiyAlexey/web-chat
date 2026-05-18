from ..core.db import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
import nanoid
from sqlalchemy import Boolean, Enum, ForeignKey, String, DateTime, func
from datetime import datetime

class Notification(Base):
  __tablename__ = 'notifications'
  
  id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(nanoid.generate(size=10)))
  
  user_id: Mapped[str] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
  invite_id: Mapped[str] = mapped_column(ForeignKey('invitations.id', ondelete='CASCADE'))
  
  invite: Mapped['Invite'] = relationship(lazy='joined')
  
  title: Mapped[str] = mapped_column(String(255), nullable=True)
  is_read: Mapped[bool] = mapped_column(Boolean, default=False)
  type: Mapped[str] = mapped_column(Enum('invite', name='invite'), default='invite')
  created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
  user: Mapped['User'] = relationship(back_populates='notifications')