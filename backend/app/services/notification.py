from ..repository import NotificationRepository
from ..schemas.notification import NotificationUpdate, NotificationCreate

class NotificationService():
  def __init__(self, repository: NotificationRepository):
    self.repository = repository
    
  async def get_notifications(self, user_id: str):
    notifications = await self.repository.get_notifications(user_id)
    return notifications
  
  async def create_notification(self, user_id: str, notification_data: NotificationCreate, invite_id: str):
    new_notification = await self.repository.create_notification(user_id, notification_data, invite_id)
    return new_notification
  
  async def update_notification(self, user_id: str, notification_id: str, **notification_data: NotificationUpdate):
    updated_notification = await self.repository.update_notification(user_id, notification_id, **notification_data)
    return updated_notification