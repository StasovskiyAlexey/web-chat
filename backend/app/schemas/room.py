from datetime import datetime
from pydantic import BaseModel

class Room(BaseModel):
  name: str
  type: str
  
class RoomCreate(Room):
  pass

class RoomUpdate(Room):
  pass

class RoomResponse(Room):
  id: str
  created_at: datetime