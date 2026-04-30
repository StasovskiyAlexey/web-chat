from datetime import datetime
from pydantic import BaseModel, ConfigDict

class Message(BaseModel):
  content: str
  room_id: str
  user_id: str
  member_id: str
  created_at: datetime

class MessageCreate(BaseModel):
  content: str
  room_id: str
  user_id: str
  member_id: str

class MessageUpdate(BaseModel):
  content: str

class MessageResponse(BaseModel):
  id: str
  content: str
  room_id: str
  user_id: str
  member_id: str
  created_at: datetime
  is_read: bool
  
  model_config = ConfigDict(from_attributes=True)