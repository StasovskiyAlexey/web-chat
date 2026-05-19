from typing import Literal

from fastapi import APIRouter, Depends

from ..schemas.response import SuccessResponse
from ..services import InviteService, RoomService
from ..dependencies.services import get_invitation_service, get_room_service

router = APIRouter(prefix='/api/v1/invitations', tags=['Invitations'])

@router.post('/accept_invite', response_model=SuccessResponse[None], description='Принятие или отмена приглашения в комнату либо от пользователя либо от владельца комнаты')
async def accept_invite(invite_id: str, notification_id: str, user_id: str, status: str, service: InviteService = Depends(get_invitation_service)):
  await service.accept_invite(invite_id, notification_id, user_id, status)
  message = ''
  
  if status == 'accepted':
    message='Приглашение принято'
  else:
    message='Приглашение отклонено'
  
  return SuccessResponse(
    message=message
  )
  
@router.post('/invite_to_room_from_user', response_model=SuccessResponse[None], description='Приглашения в комнату ОТ пользователя через код комнаты')
async def invite_to_room_from_user(user_code: str, room_code: str, title: str, service: RoomService = Depends(get_room_service)):
  await service.invite_to_room_from_user(
    user_code,
    room_code,
    title,
  )
  
  return SuccessResponse(
    message='Приглашение пользователю успешно отправлено'
  )
  
@router.post('/invite_from_room_to_user', response_model=SuccessResponse[None], description='Приглашения ИЗ комнаты через код пользователя')
async def invite_from_room_to_user(room_code: str, user_code: str, title: str, service: RoomService = Depends(get_room_service)):
  await service.invite_from_room_to_user(
    room_code,
    user_code,
    title,
  )
  return SuccessResponse(
    message='Приглашение для добавления в комнату успешно отправлено'
  )