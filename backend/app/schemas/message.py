from datetime import datetime

from pydantic import BaseModel

class Message(BaseModel):
  content: str
  room_id: str
  user_id: str
  member_id: str

class MessageCreate(Message):
  pass

class MessageUpdate(Message):
  content: str

class MessageResponse(BaseModel):
  content: str
  room_id: str
  user_id: str
  member_id: str
  created_at: datetime
  is_read: bool