import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from httpx import AsyncClient, Response
from app.schemas.user import UserResponse
from app.schemas.room import RoomResponse
import nanoid

@pytest.mark.asyncio
async def test_create_room(new_room: RoomResponse):
  pass
  
async def test_update_room(client: AsyncClient, access_token: str, new_room: tuple[RoomResponse, UserResponse, str]):
  room, owner, refresh_token = new_room
  
  if room:
    update_room_res = await client.patch('/api/v1/rooms/update_room', params={"room_id": room.id}, json={"name": "test_name", "type": "direct"}, headers={"Authorization": f"Bearer {access_token}"})
    updated_room = update_room_res.json()['data']

    assert room.id == updated_room['id']
    assert update_room_res.status_code == 200
  
@pytest.mark.asyncio
async def test_delete_room(client: AsyncClient, access_token: str, new_room: tuple[RoomResponse, UserResponse, str]):
  room, owner, refresh_token = new_room
  
  deleted_room = await client.post('/api/v1/rooms/delete_room', params={"room_id": room.id}, headers={"Authorization": f"Bearer {access_token}"}, cookies={"refresh_token": refresh_token})

  assert deleted_room.status_code == 200, 'Ошибка при удалении комнаты'

async def test_delete_member_from_room(client: AsyncClient, access_token: str, new_room: tuple[RoomResponse, UserResponse, str]):
  room, owner, refresh_token = new_room

  unique_id = nanoid.generate(size=4)
  user_data = {
    "login": f"member_{unique_id}",
    "email": f"test-{unique_id}@gmail.com",
    "password": "test"
  }
  
  # Новый пользователь которого хотим добавить в комнату
  new_user_json = await client.post('/api/v1/auth/register_user', json=user_data)
  new_member_json = new_user_json.json()['data']

  new_member_data = {
    "user_id": new_member_json['id'],
    "room_id": room.id,
    "role": "member"
  }

  # Добавление нового юзера в комнату
  add_member_to_room_res = await client.post('/api/v1/rooms/add_member_to_room', json=new_member_data, headers={"Authorization": f"Bearer {access_token}"})
  new_member = add_member_to_room_res.json()['data']

  # Удаление нового пользователя из комнаты
  delete_member_from_room_res = await client.post('/api/v1/rooms/delete_member_from_room', params={"room_id": room.id, "user_id": owner.id, "member_id": new_member['id']}, headers={"Authorization": f"Bearer {access_token}"}, cookies={"refresh_token": refresh_token})

  assert delete_member_from_room_res.status_code == 200, 'Не удалось удалить участника чата' 

async def test_delete_owner_from_room(client: AsyncClient, access_token: str, new_room: tuple[RoomResponse, UserResponse, str]):
  room, owner, refresh_token = new_room
  owner_member = None

  for member in room.members:
    if member.user_id == owner.id:
     owner_member = member

  # Удаление СЕБЯ же из комнаты
  delete_owner_from_room_res = await client.post('/api/v1/rooms/delete_member_from_room', params={"room_id": room.id, "user_id": owner.id, "member_id": owner_member.id}, headers={"Authorization": f"Bearer {access_token}"}, cookies={"refresh_token": refresh_token})

  assert delete_owner_from_room_res.status_code == 400, 'Создатель комнаты не может удалить себя из комнаты'