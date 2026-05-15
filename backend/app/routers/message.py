from typing import List

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials

from ..schemas.response import SuccessResponse
from ..schemas.message import MessageResponse, MessageCreate, MessageUpdate
from ..services import MessageService
from ..dependencies.services import get_message_service
from ..dependencies.auth import get_user_by_access_token

router = APIRouter(prefix='/api/v1/messages', tags=['Messages'])

@router.post('/add_message', response_model=SuccessResponse[MessageResponse], description='Добавление сообщения в комнату')
async def add_message(message_data: MessageCreate, service: MessageService = Depends(get_message_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
  message = await service.create_message(message_data)
  return SuccessResponse(
    data=message,
    message='Сообщение успешно добавлено'
  )

@router.patch('/update_message', response_model=SuccessResponse[List[MessageResponse]], description='Обновление сообщения по ID в комнате')
async def update_message(message_id: str, service: MessageService = Depends(get_message_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token), **message_data: MessageUpdate):
  message = await service.update_message(message_id, **message_data)
  return SuccessResponse(
    data=message,
    message='Сообщение успешно добавлено'
  )