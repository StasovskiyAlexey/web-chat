import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from httpx import AsyncClient, Response
from app.schemas.user import UserResponse
from app.schemas.room import RoomResponse

@pytest.mark.asyncio
async def test_add_message_to_room(client: AsyncClient, access_token: str, new_room: tuple[RoomResponse, UserResponse, str]):
  room, owner, refresh_token = new_room
  
  owner_member = None
  
  for member in room.members:
    owner_member = member
  
  new_message = await client.post('/api/v1/messages/add_message', json={
    "content": "test",
    "room_id": room.id,
    "user_id": owner.id,
    "member_id": owner_member.id
  }, headers={"Authorization": f"Bearer {access_token}"})
  
  print('new_message', new_message.status_code)
  assert new_message.status_code == 201, 'Ошибка при отправке сообщения'