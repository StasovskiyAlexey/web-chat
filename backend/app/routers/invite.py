from typing import List

from fastapi import APIRouter, Depends

from ..schemas.response import SuccessResponse
from ..schemas.invite import InviteResponse
from ..services.invite import InviteService
from ..dependencies.services import get_invitation_service

router = APIRouter(prefix='/api/v1/invitations', tags=['Invitations'])

@router.post('/get_user_invitations', response_model=SuccessResponse[List[InviteResponse]])
async def get_user_invitations(user_id: str, service: InviteService = Depends(get_invitation_service)):
  user_invitations = await service.get_user_invitations(user_id)
  return SuccessResponse(
    data=user_invitations
  )