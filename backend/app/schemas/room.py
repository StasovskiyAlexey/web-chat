from datetime import datetime
from typing import List
from pydantic import BaseModel
from ..schemas.member import Member
from ..schemas.message import Message
class Room(BaseModel):
  name: str
  type: str

class RoomCreate(Room):
  pass

class RoomUpdate(Room):
  pass

class RoomResponseShort(Room):
  id: str
  created_at: datetime
  members: List[Member] = []

class RoomResponse(RoomResponseShort):
  messages: List[Message]