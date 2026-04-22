from typing import List
import nanoid

from ..core.db import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

class User(Base):
  __tablename__ = 'users'
  
  id: Mapped[str] = mapped_column(primary_key=True, index=True, default=lambda: str(nanoid.generate(size=10)))
  login: Mapped[str] = mapped_column(nullable=False)
  password: Mapped[str] = mapped_column(nullable=True)
  email: Mapped[str] = mapped_column(nullable=False)
  picture: Mapped[str] = mapped_column(nullable=True)
  
  # Массив чатов юзера куда он подключен
  membership: Mapped[List['Member']] = relationship(back_populates='user')
  
  is_online: Mapped[bool] = mapped_column(default=False, nullable=False)