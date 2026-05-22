from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings
from app.core.db import Base, get_db
from app.main import app

import pytest
import os

os.environ["ENV_STATE"] = "test"

async_engine = create_async_engine(settings.database_url)
async_session = async_sessionmaker(async_engine, expire_on_commit=False, class_=AsyncSession)

@pytest.fixture(scope='session', autouse=True)
async def manage_test_db():
  async with async_engine.begin() as connection:
    await connection.run_sync(Base.metadata.create_all)
    
  yield
  
  async with async_engine.begin() as connection:
    await connection.run_sync(Base.metadata.drop_all)
    
@pytest.fixture(scope='function')
async def db_session():
  async with async_session() as session:
    yield session
    await session.rollback()
    
@pytest.fixture(autouse=True)
async def override_database(db_session: AsyncSession):
  app.dependency_overrides[get_db] = lambda: db_session
  
  yield
  
  app.dependency_overrides.clear()
  
@pytest.fixture
async def client():
  async with AsyncClient(transport=ASGITransport(app=app), base_url=settings.database_url) as client:
    yield client