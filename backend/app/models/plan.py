from pydantic import BaseModel, Field
from typing import List, Optional, Literal
 
class CleaningStep(BaseModel):
    tool_name: Literal["pandas","pyjanitor","scikit-learn"] = Field(min_length=1,description="The name of the tool/library to use (e.g., pandas, pyjanitor,scikit-learn).")
    action: str = Field(min_length=1,description="The specific function to call (e.g., drop_duplicates, fill_empty).Actions like impute_mean or label_encode are now allowed.")
    columns: Optional[List[str]] = Field(description="Which columns this step applies to. (Can be an empty list if it applies to the whole dataset).")
    reasoning: str = Field(min_length=1,description="Why the LLM chose this step.")
    confidence_score: float = Field(ge=0,le=1,description="From 0.0 to 1.0.")

class CleaningPlan(BaseModel):
    steps: List[CleaningStep] = Field(min_length=1,description=" The ordered list of steps to execute.")
    overall_strategy: str = Field(min_length=1,description="A brief summary of the entire plan.")

