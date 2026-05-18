from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from .config import settings

async_engine = create_async_engine(settings.database_url, echo=settings.debug)
async_session = async_sessionmaker(async_engine, expire_on_commit=False, class_=AsyncSession)

class Base(DeclarativeBase):
  pass

async def get_db():
  async with async_session() as session:
    yield session