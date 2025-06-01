from fastapi import FastAPI, APIRouter, Response, Body

from app.controller.prompt_controller import handle_incoming_prompt
from app.model.prompt_model import promt_schema

router = APIRouter()



@router.post('/prompt')
async def handle_prompt(response: Response, content: promt_schema):
    return await handle_incoming_prompt( response, content.dict())
