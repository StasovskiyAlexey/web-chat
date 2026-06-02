import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from httpx import AsyncClient, Response
from app.schemas.user import UserResponse

@pytest.mark.asyncio
async def test_register_user(new_user: UserResponse):
  pass

@pytest.mark.asyncio
async def test_login_user(client: AsyncClient):
  user = {
    "login": "test",
    "password": "test"
  }

  res = await client.post('/api/v1/auth/login_user', json=user)

  assert res.cookies.get('refresh_token')
  assert res.status_code == 200

@pytest.mark.asyncio
async def test_logout(client: AsyncClient):
  user = {
    "login": "test",
    "password": "test"
  }
  
  # Логинем пользователя добавляя refresh токен
  await client.post('/api/v1/auth/login_user', json=user)
  
  res = await client.get('/api/v1/auth/logout')
  assert res.status_code == 200
  
@pytest.mark.asyncio
async def test_check_user(client: AsyncClient):
  user = {
    "login": "test",
    "password": "test"
  }
  
  # Логинем пользователя добавляя refresh токен
  await client.post('/api/v1/auth/login_user', json=user)
  
  res = await client.get('/api/v1/auth/check_user')
  assert res.status_code == 200