from json import load
import re
from typing import Dict
from app.models.plan import CleaningPlan
from app.config.configs import template
from app.services.llm_service import setup_gemini
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from fastapi.responses import StreamingResponse

class AIPlanner:
    def __init__(self,report:Dict) -> None:
        self.report = report
        self.gemini_llm = setup_gemini()
        self.structured_llm = self.gemini_llm.with_structured_output(CleaningPlan)

    async def generate_plan(self):
        print("🧠 [PLANNER] Constructing LangChain prompt with dataset summary...")
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system",template),
                ("user","Craft a complete decision plan to clean the given dataset by given report : {report}")
            ]
        )           
        chain = prompt | self.structured_llm

        print("🧠 [PLANNER] Invoking Gemini LLM for structured output... (Waiting for response)")
        result = await chain.ainvoke({
            "report":self.report
        })
        
        print(f"✅ [PLANNER] Successfully generated plan with {len(result.steps)} steps!")
        return result

    

   





