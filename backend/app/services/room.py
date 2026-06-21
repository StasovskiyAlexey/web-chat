from ..core.exceptions import AppError

from ..repository import RoomRepository, MemberRepository, UserRepository, NotificationRepository, InviteRepository
from ..schemas.room import RoomUpdate
from ..schemas.member import MemberCreate
from ..schemas.invite import InviteResponse
from ..models import Room
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.websockets.websocket_manager import websocket_manager
from typing import Literal

class RoomService: 
  def __init__(self, db: AsyncSession, repository: RoomRepository, user_repository: UserRepository, member_repository: MemberRepository, notification_repository: NotificationRepository, invitation_repository: InviteRepository):
    self.db = db
    self.repository = repository
    self.user_repository = user_repository
    self.member_repository = member_repository
    self.notification_repository = notification_repository
    self.invitation_repository = invitation_repository
    
  async def get_rooms(self, user_id: str):
    rooms = await self.repository.get_rooms(user_id)
    return rooms
  
  async def get_room_by_id(self, room_id: str):
    room = await self.repository.get_room_by_id(room_id)

    if not room:
      raise AppError(400, f'Комнаты с ID {room_id} не существует')
    
    return room
  
  async def get_room_by_name(self, room_name: str):
    room = await self.repository.get_room_by_name(room_name)
    return room
  
  async def create_room(self, room_data: Room, user_id: str, role: Literal['member', 'owner']):
    new_room = await self.repository.create_room(room_data)
    member_data = MemberCreate(user_id=user_id, room_id=new_room.id, role=role)
    await self.member_repository.create_member(member_data)
    
    await self.db.commit()
    return await self.repository.get_room_with_members(new_room.id)
  
  async def update_room(self, room_id: str, **room_data: RoomUpdate):
    updated_room = await self.repository.update_room(room_id, **room_data)
    return updated_room
  
  # Работает
  async def invite_to_room_from_user(self, user_code: str, room_code: str, title: str):
    exist_room = await self.repository.get_room_by_code(room_code)
    
    if not exist_room:
      raise AppError(400, 'Комнаты с таким идентификатором не найдена')
    
    # Тот кто отправил
    inviter_user = await self.user_repository.get_user_by_code(user_code)
    
    # Тот кто получает
    room_member_owner = await self.repository.get_member_room_owner(exist_room.id)
    
    if not inviter_user:
      raise AppError(400, f'Пользователя не найдено')
    
    if not exist_room:
      raise AppError(400, 'Комната не найдена')
    
    exist_invite = await self.invitation_repository.get_active_user_invite(inviter_user.id, exist_room.id)
    
    if exist_invite:
      raise AppError(400, 'Приглашение в комнату уже отправлено')

    user_in_room = await self.repository.check_member_in_room(exist_room.id, inviter_user.id)

    if user_in_room:
      raise AppError(400, 'Пользователь уже добавлен в комнату')
    
    if await self.invitation_repository.get_active_user_invite(inviter_user.id, exist_room.id):
      raise AppError(400, 'Приглашение в комнату уже отправлено')
    
    new_invite = await self.invitation_repository.create_invite(inviter_user.id, room_member_owner.user_id, exist_room.id, "invite_to_room")
    
    if new_invite:
      new_notification = await self.notification_repository.create_notification(title, room_member_owner.user_id, new_invite.id)
    
    # Создали обьект из модели invite в new_notification
    invite_from_notification = InviteResponse.model_validate(new_notification.invite).model_dump(mode='json')
    
    notification_payload = {
      "created_at": new_notification.created_at.isoformat(),
      "id": new_notification.id,
      "invitation_id": new_notification.invite_id,
      "invite": invite_from_notification,
      "is_read": new_notification.is_read,
      "title": new_notification.title,
      "type": new_notification.type,
      "user_id": new_notification.user_id
    }
    
    await self.db.commit()
    await self.db.refresh(new_invite)
    
    await websocket_manager.broadcast_notifications_to_user({"action": "new_notification", "payload": notification_payload}, room_member_owner.user_id)
    
    return new_invite
  
  # Работает
  async def invite_from_room_to_user(self, room_code: str, user_code: str, title: str):
    exist_room = await self.repository.get_room_by_code(room_code)
    
    if not exist_room:
      raise AppError(400, 'Комнаты с таким идентификатором не найдена')
    
    # Тот кто отправляет
    room_owner_member = await self.repository.get_member_room_owner(exist_room.id)
    
    # Тот кому мы отправляем 
    inviter_user = await self.user_repository.get_user_by_code(user_code)

    if not exist_room:
      raise AppError(400, 'Такой комнаты не существует')
    
    member_owner = await self.repository.get_member_room_owner(exist_room.id)
    
    if not member_owner:
      raise AppError(404, 'Владелец комнаты не найден')
    
    exist_invite = await self.invitation_repository.get_active_user_invite(inviter_user.id, exist_room.id)
    
    current_user_in_room = await self.repository.check_member_in_room(exist_room.id, inviter_user.id)

    if exist_invite:
      raise AppError(400, 'Приглашение в комнату уже отправлено')
    
    if current_user_in_room:
      raise AppError(400, 'Пользователь уже существует в комнате')
    
    new_invite = await self.invitation_repository.create_invite(room_owner_member.user_id, inviter_user.id, exist_room.id, "invite_from_room")
    print('new_invite', new_invite)
    
    if new_invite:
      new_notification = await self.notification_repository.create_notification(title, inviter_user.id, new_invite.id)

    # Создали обьект из модели invite в new_notification
    invite_from_notification = InviteResponse.model_validate(new_notification.invite).model_dump(mode='json')

    notification_payload = {
      "created_at": new_notification.created_at.isoformat(),
      "id": new_notification.id,
      "invitation_id": new_notification.invite_id,
      "invite": invite_from_notification,
      "is_read": new_notification.is_read,
      "title": new_notification.title,
      "type": new_notification.type,
      "user_id": new_notification.user_id
    }
    
    # Проблема в том что invite это модель, и получаем notification_data в websocket
    
    await self.db.commit()
    await self.db.refresh(new_invite)
    
    connect_to_websocket = await websocket_manager.broadcast_notifications_to_user({"action": "new_notification", "payload": notification_payload}, inviter_user.id)

    return new_invite
  
  async def delete_member_from_room(self, room_id: str, user_id: str, member_id: str, owner_id: str):
    exist_room = await self.repository.get_room_by_id(room_id)
    owner_member = await self.member_repository.get_member_by_user_id(owner_id)

    if not exist_room:
      raise AppError(400, f'Комнаты с ID {room_id} не найдено')
    
    if owner_member:
      if owner_member.role != 'owner':
        raise AppError(400, 'Вы не являетесь владельцем комнаты')
    
    member_in_room = await self.repository.check_member_in_room(room_id, user_id)
    
    if not member_in_room:
      raise AppError(400, 'Пользователя в текущей комнате не найдено')
    
    exist_member = await self.member_repository.get_member_by_id(member_id)
    
    if not exist_member:
      raise AppError(400, f'Участника чата с ID {member_id} не найдено')
    
    if exist_member.role == 'owner':
      raise AppError(400, 'Создатель комнаты не может удалить себя из комнаты')
    
    deleted_member = await self.member_repository.delete_member_from_room(room_id, member_id)
    
    return deleted_member
  
  async def delete_current_room(self, room_id: str, user_id: str):
    deleted_room = await self.repository.delete_current_room(room_id, user_id)
    return deleted_room
  
  async def delete_all_rooms(self):
    deleted_rooms = await self.repository.delete_all_rooms()
    return deleted_rooms
  
  # Осталось сделать принятие приглашения эндпоинт