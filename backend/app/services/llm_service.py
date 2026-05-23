from app.config.configs import GEMINI_API_KEY
from langchain_google_genai import ChatGoogleGenerativeAI

if not GEMINI_API_KEY :
    raise Exception("Api key not found!")


def setup_gemini():
    gemini_llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite",
            google_api_key=GEMINI_API_KEY
    )
    return gemini_llm