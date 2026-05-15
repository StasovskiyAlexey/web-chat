from typing import List

from fastapi.security import HTTPAuthorizationCredentials
from ..schemas.member import MemberCreate, MemberResponse, MemberUpdate
from fastapi import APIRouter, Depends
from ..dependencies.services import get_member_service

from ..schemas.response import SuccessResponse
from ..services import MemberService
from ..dependencies.auth import get_user_by_access_token

router = APIRouter(prefix='/api/v1/members', tags=['Members'])

# @router.get('/get_members', response_model=SuccessResponse[List[MemberResponse]])
# async def get_members(service: MemberService = Depends(get_member_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
#   members = await service.get_members()
#   return SuccessResponse(
#     data=members
#   )

# @router.post('/get_member_by_id', response_model=SuccessResponse[MemberResponse])
# async def get_member_by_id(member_id: str, service: MemberService = Depends(get_member_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
#   member = await service.get_member_by_id(member_id)
#   return SuccessResponse(
#     data=member
#   )

# @router.post('/add_member', response_model=SuccessResponse[MemberResponse])
# async def add_member(member_data: MemberCreate, service: MemberService = Depends(get_member_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
#   new_member = await service.create_member(member_data)
#   return SuccessResponse(
#     data=new_member,
#     message='Пользователь чата успешно создан'
#   )

# @router.post('/update_member', response_model=SuccessResponse[MemberResponse])
# async def update_member(member_id: str, member_data: MemberUpdate, service: MemberService = Depends(get_member_service), is_have_access: HTTPAuthorizationCredentials = Depends(get_user_by_access_token)):
#   new_member = await service.update_member(member_id, **member_data.model_dump())
#   return SuccessResponse(
#     data=new_member,
#     message='Пользователь чата успешно обновлен'
#   )