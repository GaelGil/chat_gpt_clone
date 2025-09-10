import os


class Settings:
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 15
    REFRESH_TOKEN_EXPIRE_DAYS = 7


settings = Settings()
