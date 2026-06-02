from datetime import datetime
from typing import Literal
from pydantic import BaseModel
from ..schemas.user import UserResponse, User

class Member(BaseModel):
  user_id: str
  room_id: str
  role: Literal['member', 'owner']
  user: UserResponse

class MemberCreate(BaseModel):
  user_id: str
  room_id: str
  role: Literal['member', 'owner']
  
class MemberUpdate(MemberCreate):
  pass

class MemberResponse(BaseModel):
  id: str
  user_id: str
  user: User
  room_id: str
  role: str
  joined_at: datetime
