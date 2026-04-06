from pydantic_settings import BaseSettings, SettingsConfigDict

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
  
  google_client_id: str
  google_secret_client: str
  google_redirect_url: str
  
  github_client_id: str
  github_secret_client: str
  github_redirect_url: str
  
  discord_client_id: str
  discord_secret_client: str
  discord_redirect_url: str
  
  model_config = SettingsConfigDict(
    env_file='.env'
  )

  @property
  def max_image_size(self) -> int:
    return self.max_image_size_mb * 1024 * 1024
  
settings = Settings() # type: ignore