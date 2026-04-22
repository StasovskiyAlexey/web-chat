from ..core.exceptions import AppError

from ..repository import MemberRepository
from ..schemas.member import MemberCreate, MemberUpdate
from ..repository import RoomRepository

class MemberService:
  def __init__(self, repository: MemberRepository, room_repository: RoomRepository):
    self.repository = repository
    self.room_repository = room_repository
    
  async def get_members(self):
    members = await self.repository.get_members()
    return members
  
  async def get_member_by_id(self, member_id: str):
    member = await self.repository.get_member_by_id(member_id)
    return member
  
  async def get_member_by_user_id(self, user_id: str):
    member = await self.repository.get_member_by_user_id(user_id)
    return member
  
  async def create_member(self, member_data: MemberCreate):
    exist_member = await self.repository.get_member_by_user_id(member_data.user_id)
    exist_room_by_id = await self.room_repository.get_room_by_id(member_data.room_id)

    if exist_member:
      raise AppError(400, 'Пользователь уже существует в этом чате')
    
    if not exist_room_by_id:
      raise AppError(400, 'Такой комнаты не существует')
    
    new_member = await self.repository.create_member(member_data)
    
    return new_member

  async def update_member(self, member_id: str, **member_data: MemberUpdate):
    exist_member = await self.get_member_by_id(member_id)
    member = await self.repository.update_member(member_id, **member_data)
    
    if not exist_member:
      raise AppError(400, 'Такой пользователь уже существует')
    
    return member