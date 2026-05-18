from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from ..models import Notification
from ..core.exceptions import AppError
from ..schemas.notification import NotificationUpdate, NotificationCreate
from ..schemas.invite import InviteCreate

class NotificationRepository():
  def __init__(self, db: AsyncSession):
    self.db = db
    
  async def get_notifications(self, user_id: str):
    query = await self.db.execute(select(Notification).where(Notification.user_id == user_id).options(joinedload(Notification.invite)))
    notifications = query.scalars().all()
    return notifications
  
  async def get_notification_by_id(self, user_id: str, notification_id: str):
    query = await self.db.execute(select(Notification).where(Notification.user_id == user_id).options(joinedload(Notification.invite)).where(Notification.id == notification_id))
    notification = query.scalar_one_or_none()
    return notification
  
  async def create_notification(self, title: str, user_id: str, invite_id: str):
    new_notification = Notification(title=title, user_id=user_id, invite_id=invite_id)

    self.db.add(new_notification)
    await self.db.flush()
    await self.db.refresh(new_notification, ["invite"])
    return new_notification
    
  async def update_notification(self, user_id: str, notification_id: str):
    query = await self.db.execute(select(Notification).where(Notification.user_id == user_id).where(Notification.id == notification_id))
    exist_notification = query.scalar_one_or_none()

    if exist_notification:
      exist_notification.is_read = True
    
    await self.db.commit()
    await self.db.refresh(exist_notification)
    return exist_notification

  async def read_all_notifications(self, user_id: str):
    query = await self.db.execute(select(Notification).where(Notification.user_id == user_id))
    exist_notifications = query.scalars().all()
    
    # for notification in exist_notifications:
    #   if notification.is_read:
    #     raise AppError(400, 'Все уведомления уже прочитаны')
    
    for notification in exist_notifications:
      notification.is_read = True
    
    await self.db.commit()
    
    return None