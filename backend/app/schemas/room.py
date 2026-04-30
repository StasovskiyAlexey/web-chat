from datetime import datetime
from typing import List
from pydantic import BaseModel
from ..schemas.member import MemberResponse
from ..schemas.message import MessageResponse
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
  members: List[MemberResponse] = []

class RoomResponseWithMessages(RoomResponse):
  messages: List[MessageResponse] = []
