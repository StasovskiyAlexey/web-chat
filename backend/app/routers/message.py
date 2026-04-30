from typing import List

from fastapi import APIRouter, Depends

from ..schemas.response import SuccessResponse
from ..schemas.message import MessageResponse, MessageCreate, MessageUpdate
from ..services import MessageService
from ..dependencies.services import get_message_service

router = APIRouter(prefix='/api/v1/messages', tags=['Messages'])

@router.get('/get_messages', response_model=SuccessResponse[List[MessageResponse]])
async def get_messages(service: MessageService = Depends(get_message_service)):
  messages = await service.get_messages()
  return SuccessResponse(
    data=messages
  )
  
@router.post('/get_message_by_id', response_model=SuccessResponse[List[MessageResponse]])
async def get_message_by_id(message_id: str, service: MessageService = Depends(get_message_service)):
  message = await service.get_messages_by_id(message_id)
  return SuccessResponse(
    data=message
  )

@router.post('/add_message', response_model=SuccessResponse[MessageResponse])
async def add_message(message_data: MessageCreate, service: MessageService = Depends(get_message_service)):
  message = await service.create_message(message_data)
  return SuccessResponse(
    data=message,
    message='Сообщение успешно добавлено'
  )

@router.patch('/update_message', response_model=SuccessResponse[List[MessageResponse]])
async def update_message(message_id: str, service: MessageService = Depends(get_message_service), **message_data: MessageUpdate):
  message = await service.update_message(message_id, **message_data)
  return SuccessResponse(
    data=message,
    message='Сообщение успешно добавлено'
  )