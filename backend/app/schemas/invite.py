from datetime import datetime

from pydantic import BaseModel

class Invite(BaseModel):
  pass
  
class InviteCreate(Invite):
  inviter_id: str
  user_id: str
  room_id: str
  status: str

class InviteCreateToRoom(Invite):
  room_id: str

class InviteUpdate(Invite):
  status: str

class InviteResponse(BaseModel):
  id: str
  inviter_id: str
  user_id: str
  room_id: str
  status: str
  created_at: datetime