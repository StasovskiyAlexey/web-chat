from datetime import datetime
from pydantic import BaseModel
from ..schemas.invite import InviteResponse

class Notification(BaseModel):
  title: str

class NotificationCreate(Notification):
  pass

class NotificationUpdate(NotificationCreate):
  is_read: bool

class NotificationResponse(BaseModel):
  id: str
  user_id: str
  invite: InviteResponse
  title: str
  is_read: bool
  type: str
  created_at: datetime