from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..core.auth import hash_password, verify_password
from ..models.user import User
from ..core.exceptions import AppError

class UserRepository:
  def __init__(self, db: AsyncSession):
    self.db = db

  async def get_user_by_login(self, login: str):
    query = await self.db.execute(select(User).where(User.login == login))
    user = query.scalars().first()
    return user
  
  async def get_user_by_email(self, email: str):
    query = await self.db.execute(select(User).where(User.email == email))
    user = query.scalars().first()
    return user
  
  async def get_user_by_id(self, id: str):
    query = await self.db.execute(select(User).where(User.id == id))
    user = query.scalars().first()
    return user
  
  async def get_user_by_code(self, code: str):
    query = await self.db.execute(select(User).where(User.user_code == code))
    user = query.scalars().first()
    return user
  
  async def create_user(self, new_user: User):
    user = await self.get_user_by_email(new_user.email)
    
    if user:
      raise AppError(400, f'Пользователь с email {new_user.email} уже есть')
    
    if new_user.password:
      hashed_password = hash_password(new_user.password)
      new_user.password = hashed_password

    self.db.add(new_user)
    await self.db.commit()
    await self.db.refresh(new_user)
    return new_user
  
  async def login_user(self, user_data: User):
    exist_user = await self.get_user_by_login(user_data.login)
    
    if not exist_user:
      raise AppError(400, 'Такого пользователя не существует')
    
    if exist_user.password is None:
      raise AppError(400, 'Для этого аккаунта не установлен пароль. Войдите через соцсеть.')
    
    verified_password = verify_password(user_data.password, exist_user.password)
    
    if not verified_password:
      raise AppError(400, 'Пароль введен не верно')
    
    return exist_user
  
  async def update_user(self, user_id: str, **updated_data):
    result = await self.db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
      raise AppError(400, f'Пользователя с ID {user_id} не найдено')
    
    curr_password: str = updated_data.get('password', '').strip()
    new_password: str = updated_data.get('new_password', '').strip()
    
    if new_password and curr_password:
      if not verify_password(curr_password, user.password):
        raise AppError(400, 'Введеный текущий пароль не верный')
      
      if new_password == curr_password:
        print(new_password, curr_password, 'passwords')
        raise AppError(400, 'Новый пароль не может совпадать с текущим')
    
      user.password = hash_password(new_password)

    if user:
      for key, value in updated_data.items():  
        if hasattr(user, key):
          if key == 'password' or key == 'new_password':
            continue
          setattr(user, key, value)

      await self.db.commit()
      await self.db.refresh(user)
      
    return user
