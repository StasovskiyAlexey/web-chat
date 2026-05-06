from ..core.exceptions import AppError

from ..repository import RoomRepository, MemberRepository, UserRepository
from ..schemas.room import RoomUpdate
from ..schemas.member import MemberCreate
from ..models import Room
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas.notification import NotificationCreate
from ..schemas.invite import InviteCreate

from ..services.notification import NotificationService
from ..services.invite import InviteService

class RoomService: 
  def __init__(self, db: AsyncSession, repository: RoomRepository, user_repository: UserRepository, member_repository: MemberRepository, notification_service: NotificationService, invitation_service: InviteService):
    self.repository = repository
    self.user_repository = user_repository
    self.db = db
    self.member_repository = member_repository
    self.notification_service = notification_service
    self.invitation_service = invitation_service
    
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
  
  async def invite_user_to_room(self, user_code: str, inviter_id: str, notification_data: NotificationCreate, invitation_data: InviteCreate):
    exist_user = await self.user_repository.get_user_by_code(user_code)
    
    if not exist_user:
      raise AppError(400, f'Пользователя не найдено')
    
    exist_room = await self.repository.get_room_by_id(invitation_data.room_id)
    
    if not exist_room:
      raise AppError(400, 'Комната не найдена')
    
    # Это должно быть в отправке инвайта (проверка на активный инвайт)
    # active_invite = await self.repository.get_user_invite_by_id(user_id, invite_id)
    
    # if active_invite:
    #   raise AppError(400, f'Приглашение в комнату для пользователя с ID {user_id} уже есть')

    user_ids_in_room = [user.user_id for user in exist_room.members]

    if exist_user.id in user_ids_in_room:
      raise AppError(400, 'Пользователь уже добавлен в комнату')
    
    new_invite = await self.invitation_service.create_invite(inviter_id, exist_user.id, invitation_data)
    
    if new_invite:
      await self.notification_service.create_notification(exist_user.id, notification_data, new_invite.id)

    await self.db.commit()
    return new_invite
  
  async def delete_all_rooms(self):
    deleted_rooms = await self.repository.delete_all_rooms()
    return deleted_rooms