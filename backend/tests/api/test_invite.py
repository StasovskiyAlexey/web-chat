import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from httpx import AsyncClient, Response
from app.schemas.user import UserResponse
from app.schemas.room import RoomResponse
from app.schemas.invite import InviteResponse
from app.schemas.notification import NotificationResponse
import nanoid

@pytest.mark.asyncio
async def test_invite_to_room_from_user(client: AsyncClient, access_token: str, new_room: tuple[RoomResponse, UserResponse, str]):
  room, owner, refresh_token = new_room
  
  unique_id = nanoid.generate(size=4)
  user_data = {
    "login": f"invited_{unique_id}",
    "email": f"invite-{unique_id}@gmail.com",
    "password": "test"
  }

  new_user = await client.post('/api/v1/auth/register_user', json=user_data, headers={"Authorization": f"Bearer {access_token}"})
  user = new_user.json()['data']

  invite = await client.post('/api/v1/invitations/invite_to_room_from_user', params={"user_code": user['user_code'], "room_code": room.room_code, "title": "test"}, headers={"Authorization": f"Bearer {access_token}"})
  invite_res = invite.json()['data']

  assert invite.status_code == 201, 'Приглашение не создано'

  user_notifications = await client.post('/api/v1/notifications/get_notifications', params={"user_id": owner.id})

  user_notifications_res = user_notifications.json()['data']

  for notification in user_notifications_res:
    if notification['invite']['id'] == invite_res['id']:
      assert invite, 'Приглашение не найдено'

@pytest.mark.asyncio
async def test_invite_from_room_to_user(client: AsyncClient, access_token: str, new_room: tuple[RoomResponse, UserResponse, str]):
  room, owner, refresh_token = new_room
  
  unique_id = nanoid.generate(size=4)
  user_data = {
    "login": f"invited_{unique_id}",
    "email": f"invite-{unique_id}@gmail.com",
    "password": "test"
  }

  new_user = await client.post('/api/v1/auth/register_user', json=user_data, headers={"Authorization": f"Bearer {access_token}"})
  user = new_user.json()['data']
  
  invite = await client.post('/api/v1/invitations/invite_from_room_to_user', params={"user_code": user['user_code'], "room_code": room.room_code, "title": "test"}, headers={"Authorization": f"Bearer {access_token}"})
  invite_res = invite.json()['data']
  
  assert invite.status_code == 201, 'Приглашение не создано'
  
  user_notifications = await client.post('/api/v1/notifications/get_notifications', params={"user_id": user['id']})
  user_notifications_res = user_notifications.json()['data']
  
  for notification in user_notifications_res:
    if notification['invite']['id'] == invite_res['id']:
      assert invite, 'Приглашение не найдено'

@pytest.mark.asyncio
async def test_success_accept_invite(client: AsyncClient, new_invite: tuple[InviteResponse, NotificationResponse | None, UserResponse], access_token: str):
  invite, notification_invite, user = new_invite
  
  accepted_invite = await client.post('/api/v1/invitations/accept_invite', params={"invite_id": invite['id'], "notification_id": notification_invite['id'], "user_id": user['id'], "status": "accepted"}, headers={"Authorization": f"Bearer {access_token}"})

  assert accepted_invite.status_code == 200, 'Ошибка при принятии приглашения'

  user_notifications = await client.post('/api/v1/notifications/get_notifications', params={"user_id": user['id']})
  user_notifications_res = user_notifications.json()['data']
  
  exist_notification = None

  for notification in user_notifications_res:
    if notification_invite['id'] == notification['id']:
      exist_notification = notification
  
  assert exist_notification is not None, 'Уведомление не найдено после принятия инвайта'
      
  assert exist_notification['invite']['status'] == 'accepted', 'Статус инвайта внутри уведомления не изменился'
  assert exist_notification['is_read'] is True, 'Уведомление не отметилось как прочитанное'

@pytest.mark.asyncio
async def test_success_cancel_invite(client: AsyncClient, new_invite: tuple[InviteResponse, NotificationResponse | None, UserResponse], access_token: str):
  invite, notification_invite, user = new_invite
  
  accepted_invite = await client.post('/api/v1/invitations/accept_invite', params={"invite_id": invite['id'], "notification_id": notification_invite['id'], "user_id": user['id'], "status": "canceled"}, headers={"Authorization": f"Bearer {access_token}"})

  assert accepted_invite.status_code == 200, 'Ошибка при принятии приглашения'

  user_notifications = await client.post('/api/v1/notifications/get_notifications', params={"user_id": user['id']})
  user_notifications_res = user_notifications.json()['data']
  
  exist_notification = None

  for notification in user_notifications_res:
    if notification_invite['id'] == notification['id']:
      exist_notification = notification
  
  assert exist_notification is not None, 'Уведомление не найдено после принятия инвайта'
  print('exist_notification', exist_notification, accepted_invite.json())
  assert exist_notification['invite']['status'] == 'canceled', 'Статус инвайта внутри уведомления не изменился'
  assert exist_notification['is_read'] is True, 'Уведомление не отметилось как прочитанное'