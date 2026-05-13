from ..core.exceptions import AppError

from ..repository import RoomRepository, MemberRepository, UserRepository, NotificationRepository, InviteRepository
from ..schemas.room import RoomUpdate
from ..schemas.member import MemberCreate
from ..models import Room
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas.notification import NotificationCreate
from ..schemas.invite import InviteCreateFromUserToRoom, InviteCreateToRoom

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
  
  async def create_room(self, room_data: Room, user_id: str, role: str):
    new_room = await self.repository.create_room(room_data)
    member_data = MemberCreate(user_id=user_id, room_id=new_room.id, role=role)
    await self.member_repository.create_member(member_data)
    
    await self.db.commit()
    return await self.repository.get_room_with_members(new_room.id)
  
  async def update_room(self, room_id: str, **room_data: RoomUpdate):
    updated_room = await self.repository.update_room(room_id, **room_data)
    return updated_room
  
  async def invite_user_to_room(self, user_code: str, inviter_id: str, notification_data: NotificationCreate, invitation_data: InviteCreateToRoom):
    exist_user = await self.user_repository.get_user_by_code(user_code)
    
    if not exist_user:
      raise AppError(400, f'Пользователя не найдено')
    
    exist_room = await self.repository.get_room_by_id(invitation_data.room_id)
    
    if not exist_room:
      raise AppError(400, 'Комната не найдена')

    user_ids_in_room = [user.user_id for user in exist_room.members]

    if exist_user.id in user_ids_in_room:
      raise AppError(400, 'Пользователь уже добавлен в комнату')
    
    if await self.invitation_repository.is_active_user_invite(exist_user.id, invitation_data.room_id):
      raise AppError(400, 'Приглашение пользователю уже отправлено')
    
    new_invite = await self.invitation_repository.create_invite(inviter_id, exist_user.id, invitation_data.room_id)
    
    if new_invite:
      await self.notification_repository.create_notification(exist_user.id, notification_data, invitation_id=new_invite.id)

    await self.db.commit()
    
    await self.db.refresh(new_invite)
    return new_invite
  
  async def invite_from_user_to_room(self, room_code: str, notification_data: NotificationCreate, inviter_id: str):
    exist_room = await self.repository.get_room_by_code(room_code)
    
    if not exist_room:
      raise AppError(400, 'Такой комнаты не существует')
    
    for user in exist_room.members:
      if user.user_id == inviter_id:
        raise AppError(400, 'Этот пользователь уже находится в комнате')
      
      if user.role == 'owner':
        exist_user = await self.user_repository.get_user_by_id(user.user_id)
        
        exist_invite = await self.invitation_repository.is_active_user_invite(exist_user.id, exist_room.id)
        current_user_in_room = await self.repository.check_member_in_room(exist_room.id, exist_user.id)
        
        print('exist_user', exist_user)
        
        if not exist_user:
          AppError(400, 'Пользователь не найден')
          
    if exist_invite:
      raise AppError(400, 'Приглашение в комнату еще существует')
    
    if current_user_in_room:
      raise AppError(400, 'Пользователь уже существует в комнате')
      
    if exist_user:
      new_invite = await self.invitation_repository.create_invite(inviter_id, exist_user.id, exist_room.id)
    
    if new_invite:
      await self.notification_repository.create_notification(exist_user.id, notification_data, new_invite.id)
    
    await self.db.commit()
    
    await self.db.refresh(new_invite)
    return new_invite
  
  async def delete_current_room(self, room_id: str, user_id: str):
    deleted_room = await self.repository.delete_current_room(room_id, user_id)
    return deleted_room
  
  async def delete_all_rooms(self):
    deleted_rooms = await self.repository.delete_all_rooms()
    return deleted_rooms