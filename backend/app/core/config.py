from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "HIRKANI API"
    debug: bool = False
    secret_key: str = "change_me"
    access_token_expire_minutes: int = 60 * 24 * 7

    database_url: str = "sqlite:///./hirkani.db"
    redis_url: str = "redis://localhost:6379/0"

    openfoodfacts_base_url: str = "https://world.openfoodfacts.org/api/v2"
    usda_api_key: str = ""

    cors_origins: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
