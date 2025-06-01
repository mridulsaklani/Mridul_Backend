from fastapi import FastAPI
import fastapi
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.router.prompt_routes import router as prompt_router

load_dotenv()

app = FastAPI()



origins = [
    os.getenv('CLIENT_URL')
    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"]
    
)

app.include_router(prompt_router, prefix='/api')


@app.get('/')
def welcome():
    return {"message": "Welcome to fucking place!"}
