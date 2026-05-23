import json
from typing import Dict
from app.models.plan import CleaningPlan
from app.config.configs import template
from app.services.llm_service import setup_gemini
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate


class AIPlanner:
    def __init__(self, report: Dict) -> None:
        self.report = report
        self._llm = None

    @property
    def llm(self):
        if self._llm is None:
            self._llm = setup_gemini()
        return self._llm

    async def generate_plan(self) -> CleaningPlan:
        prompt = ChatPromptTemplate.from_messages([
            ("system", template),
            (
                "user",
                "Here is the dataset analysis report in JSON format:\n\n{report}\n\n"
                "Generate a complete, ordered cleaning plan following all phases and rules defined in your instructions."
            ),
        ])
        self.structured_llm = self.llm.with_structured_output(CleaningPlan)
        chain = prompt | self.structured_llm

        try:
            print("🧠 [PLANNER] Invoking Gemini for structured cleaning plan...")
            result = await chain.ainvoke({
                "report": json.dumps(self.report, indent=2)
            })
            print(f"✅ [PLANNER] Plan generated with {len(result.steps)} steps.")
            return result
        except Exception as e:
            print(f"❌ [PLANNER] Plan generation failed: {e}")
            raise RuntimeError(f"Plan generation failed: {e}") from e