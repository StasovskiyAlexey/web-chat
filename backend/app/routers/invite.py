from fastapi import APIRouter, Depends

from ..schemas.response import SuccessResponse
from ..schemas.invite import InviteResponse, InviteCreate, InviteUpdate
from ..services.invite import InviteService
from ..dependencies.services import get_invitation_service

router = APIRouter(prefix='/api/v1/invitations', tags=['Invitations'])

# @router.post('/get_user_invitations', response_model=SuccessResponse[InvitationResponse])
# async def get_user_invitations(user_id: str, service: InvitationService = Depends(get_invitation_service)):
#   user_invitations = await service.get_user_invitations(user_id)
#   return SuccessResponse(
#     data=user_invitations
#   )

# @router.post('/get_user_invite_by_id', response_model=SuccessResponse[InvitationResponse])
# async def get_user_invite_by_id(user_id: str, invitation_id: str, service: InvitationService = Depends(get_invitation_service)):
#   user_invitation = await service.get_user_invite_by_id(user_id, invitation_id)
#   return SuccessResponse(
#     data=user_invitation
#   )

# @router.post('/create_user_invite', response_model=SuccessResponse[InvitationResponse])
# async def create_user_invite(inviter_id: str, user_id: str, user_data: InvitationCreate, service: InvitationService = Depends(get_invitation_service)):
#   new_user_invitation = await service.create_invite(inviter_id, user_id, user_data)
#   return SuccessResponse(
#     data=new_user_invitation,
#     message='Приглашение пользователя успешно создано'
#   )

@router.post('/accept_room_invite', response_model=SuccessResponse[InviteResponse])
async def accept_room_invite(invite_id: str, user_id: str, invite_data: InviteUpdate, service: InviteService = Depends(get_invitation_service)):
  new_user_invitation = await service.accept_room_invite(invite_data.room_id, invite_id, user_id, invite_data)
  return SuccessResponse(
    data=new_user_invitation,
    message='Приглашение пользователя успешно принято, пользователь добавлен в комнату'
  )