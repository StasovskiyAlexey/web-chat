from typing import List

from fastapi import APIRouter, Depends

from ..schemas.response import SuccessResponse
from ..schemas.invite import InviteResponse
from ..services.invite import InviteService
from ..dependencies.services import get_invitation_service

router = APIRouter(prefix='/api/v1/invitations', tags=['Invitations'])

@router.post('/accept_all_invites', response_model=SuccessResponse[List[InviteResponse]])
async def accept_all_invites(user_id: str, service: InviteService = Depends(get_invitation_service)):
  await service.repository.accept_all_user_invites(user_id)
  return SuccessResponse(
    data=None
  )