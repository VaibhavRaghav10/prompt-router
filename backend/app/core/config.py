from pydantic import BaseModel


class Settings(BaseModel):
    # Frontend origin for CORS; kept simple for MVP.
    frontend_origin: str = "http://localhost:3000"


settings = Settings()
