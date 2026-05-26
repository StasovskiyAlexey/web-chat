import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import User

@pytest.mark.asyncio
async def test_register_user(client: AsyncClient, db_session: AsyncSession):
  new_user = {
    "login": "test",
    "email": "test@gmail.com",
    "password": "test"
  }
  
  res = await client.post('/api/v1/auth/register_user', json=new_user)
  
  assert 'refresh_token' in res.cookies, 'refresh токен не получен при регистрации пользователя'
  assert res.status_code == 201
  response_json = res.json()

  assert response_json['data']['login'] == 'test'
  assert response_json['data']['email'] == "test@gmail.com"
  
@pytest.mark.asyncio
async def test_login_user(client: AsyncClient):
  user = {
    "login": "test",
    "password": "test"
  }
  
  res = await client.post('/api/v1/auth/login_user', json=user)
  print('data', res.cookies.get('refresh_token'))
  
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