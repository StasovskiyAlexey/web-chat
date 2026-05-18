from datetime import datetime
from pydantic import BaseModel

class Invite(BaseModel):
  # user_id: str
  # room_id: str
  type: str
  
class InviteCreate(Invite):
  pass

class InviteResponse(BaseModel):
  id: str
  inviter_id: str
  user_id: str
  room_id: str
  status: str
  type: str
  created_at: datetime