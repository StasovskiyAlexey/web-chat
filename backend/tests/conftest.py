import pytest
import os

os.environ["ENV_STATE"] = "test"

from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import Base, get_db, async_engine, async_session
from app.main import app

# Фикстура для создания БД, где модульный scope, который будет работать внутри файла, он будет создавать внутри одного файла и там же удаляться
@pytest.fixture(scope='module', autouse=True)
async def manage_test_db():
  
  # Создание БД
  async with async_engine.begin() as connection:
    await connection.run_sync(Base.metadata.create_all)
    
  # Останавливаем выполнение функции до того момента как она выполнится
  yield
  
  # Удаление БД
  async with async_engine.begin() as connection:
    await connection.run_sync(Base.metadata.drop_all)

# Фикстура сессии для работы с тестовой БД
@pytest.fixture(scope='function')
async def db_session():
  async with async_session() as session:
    # Открываем сессию через yield генератор, где будет работа сессии
    yield session
    
    # Закрываем сессию чтобы новая функция не видела работу текущей
    await session.rollback()

# Замена нашей основной БД на тестовую
@pytest.fixture(autouse=True)
async def database_replacement(db_session: AsyncSession):
  async def override_get_db():
    yield db_session
  
  # Подменяем get_db в зависимостях нашего Fastapi приложения
  app.dependency_overrides[get_db] = override_get_db
  
  # Выполнение теста
  yield
  
  # Удаляем эту подмену зависимости
  app.dependency_overrides.clear()

# Фикстура клиент, для отправки запроса(имитация реального пользователя)
@pytest.fixture
async def client():
  async with AsyncClient(transport=ASGITransport(app=app), base_url='http://test') as client:
    yield client
