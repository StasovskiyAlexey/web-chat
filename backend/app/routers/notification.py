from typing import List

from fastapi import APIRouter, Depends
from ..schemas.response import SuccessResponse
from ..schemas.notification import NotificationCreate, NotificationResponse, NotificationUpdate
from ..services import NotificationService
from ..dependencies.services import get_notification_service

router = APIRouter(prefix='/api/v1/notifications', tags=['Notifications'])

@router.post('/get_notifications', response_model=SuccessResponse[List[NotificationResponse]], description='Получение всех уведомлений пользователя')
async def get_notifications(user_id: str, service: NotificationService = Depends(get_notification_service)):
  notifications = await service.get_notifications(user_id)
  return SuccessResponse(
    data=notifications
  )

# @router.post('/add_notification', response_model=SuccessResponse[NotificationResponse], description='Добавить уведомление')
# async def add_notifications(user_id: str, invite_id: str, notification_data: NotificationCreate, service: NotificationService = Depends(get_notification_service)):
#   new_notification = await service.create_notification(user_id, notification_data, invite_id)
#   return SuccessResponse(
#     data=new_notification,
#     message='Уведомление успешно добавлено'
#   )