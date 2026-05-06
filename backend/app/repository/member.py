from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.exceptions import AppError
from ..models.member import Member
from ..schemas.member import MemberCreate

class MemberRepository:
  def __init__(self, db: AsyncSession):
    self.db = db
    
  async def get_members(self):
    query = await self.db.execute(select(Member))
    members = query.scalars().all()
    return members
  
  async def get_member_by_user_code(self, member_id: str):
    query = await self.db.execute(select(Member).where(Member.id == member_id))
    member = query.scalars().first()
    return member
  
  async def get_member_by_id(self, member_id: str):
    query = await self.db.execute(select(Member).where(Member.id == member_id))
    member = query.scalars().first()
    return member
  
  async def get_member_by_user_id(self, user_id: str):
    query = await self.db.execute(select(Member).where(Member.user_id == user_id))
    member = query.scalars().first()
    return member
  
  async def get_member_by_room_id(self, room_id: str):
    query = await self.db.execute(select(Member).where(Member.room_id == room_id))
    member = query.scalars().first()
    return member
  
  async def create_member(self, member_data: MemberCreate):
    new_member = Member(user_id=member_data.user_id, room_id=member_data.room_id, role=member_data.role)
    
    try:
      self.db.add(new_member)
      await self.db.commit()
      await self.db.refresh(new_member)
      return new_member
    except Exception as e:
      await self.db.rollback()
      raise AppError(500, f"Ошибка при cоздании пользователя чата: {str(e)}")
    
  async def update_member(self, member_id: str, **member_data):
    exist_member = await self.get_member_by_user_id(member_id)
    
    for key, value in member_data.items():
      if hasattr(exist_member, key):
        setattr(exist_member, key, value)
    
    await self.db.commit()
    await self.db.refresh(exist_member)
    return exist_member