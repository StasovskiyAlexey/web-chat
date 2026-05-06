from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..models import Notification
from ..core.exceptions import AppError
from ..schemas.notification import NotificationUpdate, NotificationCreate

class NotificationRepository():
  def __init__(self, db: AsyncSession):
    self.db = db
    
  async def get_notifications(self, user_id: str):
    query = await self.db.execute(select(Notification).where(Notification.user_id == user_id))
    notifications = query.scalars().all()
    return notifications
  
  async def create_notification(self, user_id: str, notification_data: NotificationCreate, invite_id: str):
    new_notification = Notification(invitation_id=invite_id ,title=notification_data.title, user_id=user_id)

    try:
      self.db.add(new_notification)
      # await self.db.commit()
      # await self.db.refresh(new_notification)
      await self.db.flush()
      return new_notification
    except Exception as e:
      await self.db.rollback()
      raise AppError(500, f"Ошибка при cоздании оповещения: {str(e)}")
    
  async def update_notification(self, user_id: str, notification_id: str, **notification_data: NotificationUpdate):
    query = await self.db.execute(select(Notification).where(Notification.user_id == user_id).where(Notification.id == notification_id))
    notification = query.scalar_one_or_none()
    
    for key, value in notification_data.items():
      if hasattr(notification, key):
        setattr(notification, key, value)
    
    await self.db.commit()
    await self.db.refresh(notification)
    return notification
    