from ..core.exceptions import AppError

from ..repository import RoomRepository
from ..schemas.room import RoomUpdate
from ..models import room

class RoomService: 
  def __init__(self, repository: RoomRepository):
    self.repository = repository
    
  async def get_rooms(self):
    rooms = await self.repository.get_rooms()
    print('rooms', rooms)
    return rooms
  
  async def get_room_by_id(self, room_id: str):
    room = await self.repository.get_room_by_id(room_id)
    
    if not room:
      raise AppError(400, f'Комнаты с ID {room_id} не существует')
    
    return room
  
  async def get_room_by_name(self, room_name: str):
    room = await self.repository.get_room_by_name(room_name)
    return room
  
  async def create_room(self, room_data: room.Room):
    new_room = await self.repository.create_room(room_data)
    return new_room
  
  async def update_room(self, room_id: str, **room_data: RoomUpdate):
    updated_room = await self.repository.update_room(room_id, **room_data)
    return updated_room