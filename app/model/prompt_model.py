from pydantic import BaseModel, Field



class promt_schema(BaseModel):
    content: str = Field(...)