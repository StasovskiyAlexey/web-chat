from ..core.exceptions import AppError

from ..repository import RoomRepository, MemberRepository, UserRepository
from ..schemas.room import RoomUpdate
from ..schemas.member import MemberCreate
from ..models import Room
from sqlalchemy.ext.asyncio import AsyncSession

class RoomService: 
  def __init__(self, db: AsyncSession, repository: RoomRepository, member_repository: MemberRepository):
    self.repository = repository
    self.db = db
    self.member_repository = member_repository
    
  async def get_rooms(self):
    rooms = await self.repository.get_rooms()
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
    await self.db.refresh(new_room, attribute_names=['members', 'messages'])
    
    return new_room
  
  async def update_room(self, room_id: str, **room_data: RoomUpdate):
    updated_room = await self.repository.update_room(room_id, **room_data)
    return updated_room