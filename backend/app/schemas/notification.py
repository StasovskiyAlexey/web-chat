from datetime import datetime
from pydantic import BaseModel
from ..schemas.invite import Invite

class Notification(BaseModel):
  title: str
  type: str

class NotificationCreate(Notification):
  title: str
  type: str

class NotificationUpdate(NotificationCreate):
  is_read: bool

class NotificationResponse(BaseModel):
  id: str
  user_id: str
  invitation_id: str
  title: str
  is_read: bool
  type: str
  invitation: 'Invite'
  created_at: datetime