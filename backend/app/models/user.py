from typing import Optional
import nanoid
from sqlalchemy import JSON

from ..core.db import Base
from sqlalchemy.orm import Mapped, mapped_column

class User(Base):
  __tablename__ = 'users'
  
  id: Mapped[str] = mapped_column(primary_key=True, index=True, default=lambda: str(nanoid.generate(size=10)))
  login: Mapped[str] = mapped_column(nullable=False)
  password: Mapped[str] = mapped_column(nullable=True)
  email: Mapped[str] = mapped_column(nullable=False)
  picture: Mapped[str] = mapped_column(nullable=True)