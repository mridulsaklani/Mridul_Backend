import os
from fastapi import Response, HTTPException, status
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()


api_key = os.getenv('AISTUDIO_API_KEY')
if not api_key:
    raise RuntimeError("Missing AISTUDIO_API_KEY in environment variables")

genai.configure(api_key=api_key)




async def handle_incoming_prompt(response: Response, content: dict):
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = content.get('content')

    if not prompt:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='No prompt content provided')

    try:
        result = model.generate_content(prompt)

        if not result or not hasattr(result, 'text'):
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Invalid response from model')

        response.status_code = status.HTTP_200_OK
        return {
            'message': 'Response retrieved successfully',
            'res': result.text
        }

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
