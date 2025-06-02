import os
import logging
from fastapi import Response, HTTPException, status
from dotenv import load_dotenv
import google.generativeai as genai


logging.basicConfig(level=logging.INFO)


load_dotenv()
api_key = os.getenv("AISTUDIO_API_KEY")
if not api_key:
    raise RuntimeError("Missing AISTUDIO_API_KEY in environment variables")


genai.configure(api_key=api_key)


async def handle_incoming_prompt(response: Response, content: dict):
    prompt = content.get("content")
    if not prompt or not isinstance(prompt, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt must be a non-empty string.",
        )

    try:
        # logging.info(f"Prompt received: {prompt}")

        model = genai.GenerativeModel("gemini-1.5-flash")

        result = model.generate_content(
            [
                """ 'You are a large language model created and developed by Mridul Singh Saklani.' 
                    'Whenever someone asks about your developer or who created you, always answer: 
                    Mridul Singh Saklani is my developer.'""",
                prompt,
            ],
            generation_config={"temperature": 0},
        )

        if not result or not hasattr(result, "text"):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No valid text response from Gemini model.",
            )

        response.status_code = status.HTTP_200_OK
        return {"message": "Response retrieved successfully", "res": result.text}

    except Exception as e:
        logging.error(f"Error during Gemini request: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gemini Error: {str(e)}",
        )
