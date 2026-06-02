import pytest
import os

from sqlalchemy.ext.asyncio import AsyncSession
from httpx import AsyncClient, Response
from app.schemas.user import UserResponse
from app.schemas.room import RoomResponse
from app.schemas.invite import InviteResponse
from app.schemas.notification import NotificationResponse

os.environ["ENV_STATE"] = "test"

from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import Base, get_db, async_engine, async_session

from app.main import app
import nanoid

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

@pytest.fixture(scope='function')
async def new_user(client: AsyncClient) -> tuple[UserResponse, str]:
  user_data = {
    "login": "test",
    "email": f"test-{nanoid.generate(size=4)}@gmail.com",
    "password": "test"
  }
  
  user_res = await client.post('/api/v1/auth/register_user', json=user_data)
  
  assert 'refresh_token' in user_res.cookies, 'refresh токен не получен при регистрации пользователя'
  
  user = user_res.json()['data']
  
  # Для доступа к управление комнатой
  refresh_token = user_res.cookies['refresh_token']
  return UserResponse.model_validate(user), refresh_token

@pytest.fixture(scope='function')
async def new_room(client: AsyncClient, access_token: str, new_user: tuple[UserResponse, str]) -> tuple[RoomResponse, UserResponse, str]:
  user, refresh_token = new_user
  
  room_data = {
    "name": f"test-room-{nanoid.generate(size=4)}",
    "type": "direct"
  }
  
  room_res = await client.post(
    url='/api/v1/rooms/create_room',
    json=room_data, params={"user_id": user.id, "role": 'owner'},
    headers={"Authorization": f"Bearer {access_token}"}
  )

  room = room_res.json()['data']
  
  return RoomResponse.model_validate(room), user, refresh_token

@pytest.fixture(scope='function')
async def access_token(client: AsyncClient, new_user: UserResponse):
  token = {}
  
  if new_user:
    token_res = await client.post('/api/v1/auth/refresh')
    token = token_res.json()

  # На выходе получаем лишь обьект, вызов функции уже воспроизводится здесь
  return token.get('access_token')

@pytest.fixture(scope='function')
async def new_invite(client: AsyncClient, new_room: tuple[RoomResponse, UserResponse, str]) -> tuple[InviteResponse, NotificationResponse | None, UserResponse]:
  room, _user, refresh_token = new_room
  
  unique_id = nanoid.generate(size=4)
  user_data = {
    "login": f"invited_{unique_id}",
    "email": f"invite-{unique_id}@gmail.com",
    "password": "test"
  }

  new_user = await client.post('/api/v1/auth/register_user', json=user_data, headers={"Authorization": f"Bearer {access_token}"})
  user = new_user.json()['data']
  
  invite_from_room_to_user = await client.post('/api/v1/invitations/invite_from_room_to_user', params={"user_code": user['user_code'], "room_code": room.room_code, "title": "test"}, headers={"Authorization": f"Bearer {access_token}"})
  invite_from_room_to_user_res = invite_from_room_to_user.json()['data']
  
  user_notifications = await client.post('/api/v1/notifications/get_notifications', params={"user_id": user['id']})
  user_notifications_res = user_notifications.json()['data']
  
  notification_invite = None
  
  for notification in user_notifications_res:
    if invite_from_room_to_user_res['id'] == notification['invite']['id']:
      notification_invite = notification
  
  return invite_from_room_to_user_res, notification_invite, user