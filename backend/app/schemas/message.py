from datetime import datetime
from pydantic import BaseModel

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
  room_id: str
  user_id: str
  member_id: str

class MessageResponse(BaseModel):
  content: str
  room_id: str
  user_id: str
  member_id: str
  created_at: datetime
  is_read: bool