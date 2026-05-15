from typing import List

from fastapi import APIRouter, Depends
from ..schemas.response import SuccessResponse
from ..schemas.notification import NotificationCreate, NotificationResponse, NotificationUpdate
from ..services import NotificationService
from ..dependencies.services import get_notification_service

router = APIRouter(prefix='/api/v1/notifications', tags=['Notifications'])

@router.post('/get_notifications', response_model=SuccessResponse[List[NotificationResponse]])
async def get_notifications(user_id: str, service: NotificationService = Depends(get_notification_service)):
  notifications = await service.get_notifications(user_id)
  return SuccessResponse(
    data=notifications
  )

@router.post('/add_notification', response_model=SuccessResponse[NotificationResponse])
async def add_notifications(user_id: str, invite_id: str, notification_data: NotificationCreate, service: NotificationService = Depends(get_notification_service)):
  new_notification = await service.create_notification(user_id, notification_data, invite_id)
  return SuccessResponse(
    data=new_notification,
    message='Уведомление успешно добавлено'
  )

@router.post('/update_notification', response_model=SuccessResponse[NotificationResponse], description='В основном для обновления is_read оповещения, и для принятие или отмены инвайтов')
async def update_notification(user_id: str, notification_id: str, service: NotificationService = Depends(get_notification_service), **notification_data: NotificationUpdate):
  updated_notification = await service.update_notification(user_id, notification_id, **notification_data)
  return SuccessResponse(
    data=updated_notification,
    message='Уведомление успешно обновлено'
  )
  
@router.post('/read_all_notifications', response_model=SuccessResponse[NotificationResponse])
async def read_all_notifications(user_id: str, service: NotificationService = Depends(get_notification_service)):
  await service.read_all_notifications(user_id)
  return SuccessResponse(
    data=None
  )