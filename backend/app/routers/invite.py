from fastapi import APIRouter, Depends

from ..schemas.response import SuccessResponse
from ..services.invite import InviteService
from ..dependencies.services import get_invitation_service

router = APIRouter(prefix='/api/v1/invitations', tags=['Invitations'])

@router.post('/accept_room_invite', response_model=SuccessResponse[None], description='Принятие или отмена приглашения в комнату либо от пользователя либо от владельца комнаты')
async def accept_room_invite(invite_id: str, notification_id: str, user_id: str, status: str, service: InviteService = Depends(get_invitation_service)):
  await service.accept_room_invite(invite_id, notification_id, user_id, status)
  message = ''
  
  if status == 'accepted':
    message='Приглашение принято'
  else:
    message='Приглашение отклонено'
  
  return SuccessResponse(
    message=message
  )