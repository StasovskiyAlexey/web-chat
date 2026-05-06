from re import S

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional

class SocialAccount(BaseModel):
  id: str
  email: EmailStr
  login: str
  picture: str | None = None

class User(BaseModel):
  login: str
  email: str
  picture: Optional[str]
  
class UserCreate(BaseModel):
  login: str
  password: str
  email: EmailStr

  model_config = ConfigDict(from_attributes=True)
  
class UserLogin(BaseModel):
  login: str
  password: str

class UserUpdate(BaseModel):
  login: str
  email: str
  password: str
  new_password: str

class UserResponse(BaseModel):
  id: str
  login: str
  email: EmailStr
  user_code: str
  picture: str | None
  
  model_config = ConfigDict(from_attributes=True)