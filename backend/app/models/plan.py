from pydantic import BaseModel, Field
from typing import List, Optional, Literal
 
class CleaningStep(BaseModel):
    tool_name: Literal["pandas","pyjanitor","scikit-learn"] = Field(min_length=1,description="The name of the tool/library to use (e.g., pandas, pyjanitor,scikit-learn).")
    action: Literal[
    # Phase 1 - Foundation (pyjanitor)
    "clean_names", "remove_empty",
    # Phase 2 - Parsing (pandas)
    "standardize_nulls", "strip_whitespace", "lowercase_strings",
    "cast_to_float", "parse_datetime", "extract_datetime_features",
    "validate_emails", "nullify_outliers",
    # Phase 3 - Deduplication (pandas)
    "drop_duplicates", "dropna",
    # Phase 4 - Imputation (pandas)
    "impute_mean", "impute_median", "impute_mode",
    # Phase 5 - Encoding (scikit-learn)
    "label_encode", "onehot_encode",
    # Phase 6 - Scaling (scikit-learn)
    "standard_scale", "minmax_scale",
    ]
    columns: List[str] = Field(default_factory=list,description="Which columns this step applies to. (Can be an empty list if it applies to the whole dataset).")
    reasoning: str = Field(min_length=1,description="Why the LLM chose this step.")
    confidence_score: float = Field(ge=0,le=1,description="From 0.0 to 1.0.")

class CleaningPlan(BaseModel):
    steps: List[CleaningStep] = Field(min_length=1,description=" The ordered list of steps to execute.")
    overall_strategy: str = Field(min_length=1,description="A brief summary of the entire plan.")

