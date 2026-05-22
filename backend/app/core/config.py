from pydantic_settings import BaseSettings, SettingsConfigDict
import os

ENV_STATE = os.getenv('ENV_STATE', 'dev')

class Settings(BaseSettings):
  secret_key: str
  database_url: str
  debug: bool
  max_image_size_mb: int
  postgres_db: str
  postgres_user: str
  postgres_password: str
  cors_origins: list = [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:8000",
      "http://127.0.0.1:5173"
  ]

  model_config = SettingsConfigDict(
    env_file=('.env.test' if ENV_STATE == 'test' else ".env.dev"),
    extra='ignore'
  )

  @property
  def max_image_size(self) -> int:
    return self.max_image_size_mb * 1024 * 1024
  
settings = Settings() # type: ignore