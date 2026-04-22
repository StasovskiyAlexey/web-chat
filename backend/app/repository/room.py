from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.exceptions import AppError
from ..models.room import Room

class RoomRepository:
  def __init__(self, db: AsyncSession):
    self.db = db
    
  async def get_rooms(self):
    query = await self.db.execute(select(Room))
    rooms = query.scalars().all()
    return rooms
  
  async def get_room_by_id(self, room_id: str):
    query = await self.db.execute(select(Room).where(Room.id == room_id))
    room = query.scalars().first()
    return room
  
  async def get_room_by_name(self, room_name: str):
    query = await self.db.execute(select(Room).where(Room.name == room_name))
    room = query.scalars().all()
    return room
  
  async def create_room(self, new_room: Room):
    exist_room = await self.get_room_by_name(new_room.name)
    
    if exist_room:
      raise AppError(400, 'Такая комната уже существует')
    
    if new_room.type != 'direct' and new_room.type != 'group':
      raise AppError(400, 'Укажите правильный тип')

    self.db.add(new_room)
    try:
      await self.db.commit()
      await self.db.refresh(new_room)
      return new_room
    except Exception as e:
      await self.db.rollback() # Откатываем, если что-то пошло не так
      raise AppError(500, f"Ошибка при cоздании комнаты: {str(e)}")
  
  async def update_room(self, room_id: str, **room_data):
    exist_room = await self.get_room_by_id(room_id)
    
    if not exist_room:
      raise AppError(400, 'Такой комнаты не существует')
    
    for key, value in room_data.items():
      if hasattr(exist_room, key):
        setattr(exist_room, key, value)

    try:
      await self.db.commit()
      await self.db.refresh(exist_room)
      return exist_room
    except Exception as e:
      await self.db.rollback()
      raise AppError(500, f"Ошибка при cоздании комнаты: {str(e)}")