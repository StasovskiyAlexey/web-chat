import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
  new_user = {
    "login": "test",
    "email": "test@gmail.com",
    "password": "test",
  }
  
  res = await client.post('/api/v1/auth/register_user', json=new_user)
  
  assert res.status_code == 201
  response_json = res.json()
  
  assert response_json['login'] == 'test'