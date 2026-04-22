from datetime import datetime
from pydantic import BaseModel

from ..schemas import User, Room

class Member(BaseModel):
  user_id: str
  room_id: str
  role: str

class MemberCreate(BaseModel):
  user_id: str
  room_id: str
  role: str
  
class MemberUpdate(MemberCreate):
  pass

class MemberResponse(BaseModel):
  id: str
  user_id: str
  room_id: str
  role: str
  joined_at: datetime