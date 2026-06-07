from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict

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
  status: Literal["pending", "accepted", 'canceled']
  type: str
  created_at: datetime
  
  model_config = ConfigDict(from_attributes=True)