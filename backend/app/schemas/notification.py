from datetime import datetime
from pydantic import BaseModel

class Notification(BaseModel):
  # user_id: str
  title: str
  # invitation_id: str
  type: str

class NotificationCreate(Notification):
  pass

class NotificationUpdate(Notification):
  pass

class NotificationResponse(BaseModel):
  id: str
  user_id: str
  invitation_id: str
  title: str
  is_read: bool
  type: str
  created_at: datetime