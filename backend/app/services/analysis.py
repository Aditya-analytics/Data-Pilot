import os
import math
import pandas as pd
import json


def count_sentinels(df: pd.DataFrame) -> dict:
    SENTINEL_VALUES: set[str] = {"n/a", "na", "null", "none", "nan", "", "?", "-", "missing"}
    counts = {}
    for col in df.select_dtypes(include="object").columns:
        mask = df[col].str.strip().str.lower().isin(SENTINEL_VALUES)
        if mask.sum() > 0:
            counts[col] = int(mask.sum())
    return counts

def clean_dict(d):
    """Recursively converts NaN and Infinity floats to None for strict JSON serialization."""
    if isinstance(d, dict):
        return {k: clean_dict(v) for k, v in d.items()}
    elif isinstance(d, list):
        return [clean_dict(v) for v in d]
    elif isinstance(d, float):
        if math.isnan(d) or math.isinf(d):
            return None
        return d
    return d

def infer_likely_type(series: pd.Series) -> str:
    if pd.api.types.is_numeric_dtype(series):
        return "numeric"
    if pd.api.types.is_datetime64_any_dtype(series):
        return "datetime"
    # Try stripping symbols and parsing as number
    cleaned = series.dropna().astype(str).str.replace(r"[$,€£%\s]", "", regex=True)
    numeric_ratio = pd.to_numeric(cleaned, errors="coerce").notna().mean()
    if numeric_ratio > 0.7:
        return "likely_numeric"
    # Try parsing as date
    try:
        parsed = pd.to_datetime(series.dropna().astype(str), infer_datetime_format=True, errors="coerce")
        if parsed.notna().mean() > 0.7:
            return "likely_datetime"
    except Exception:
        pass
    return "categorical"

class DataAnalyzer:
    def __init__(self):
        self.upload_dir = "backend/uploads"

    def get_csv(self, dataset_id: str) -> str:
        csv_file = os.path.join(f"{self.upload_dir}/{dataset_id}.csv")

        if not os.path.exists(csv_file):
            raise FileNotFoundError(f"Dataset {dataset_id} does not exist.")
        
        return csv_file
    
    
    def analyze_csv(self, dataset_id: str) -> dict:
        print(f"👉 [ANALYSIS] Starting analysis for dataset: {dataset_id}")
        file = self.get_csv(dataset_id)
        print(f"👉 [ANALYSIS] Reading CSV file: {file}")
        df = pd.read_csv(file, on_bad_lines='skip')
        print(f"👉 [ANALYSIS] Loaded {len(df)} rows and {len(df.columns)} columns.")

        # 1. Safely extract JSON-serializable dictionaries
        null_counts = df.isnull().sum().to_dict()
        data_types = df.dtypes.astype(str).to_dict()
        num_cols = df.select_dtypes(include=['number']).columns.tolist()


        
        corr_df = df[num_cols].corr()
        corr= clean_dict(corr_df.to_dict())


        # 2. Build explicit column details list
        column_details = []
        for col in df.columns:
            # Simple heuristic for identifier columns
            lower_col = col.lower()
            is_identifier = any(x in lower_col for x in ["id", "email", "phone", "name", "uuid", "key"]) or \
                            (data_types[col] == "object" and int(df[col].nunique()) == int(len(df)))

            col_info = {
                "name": col,
                "type": data_types[col],
                "missing_count": int(null_counts[col]),
                "unique_count": int(df[col].nunique()),
                "likely_type": infer_likely_type(df[col]),
                "is_identifier": bool(is_identifier),
                "sample_values": [
                    v.item() if hasattr(v, "item") else v
                    for v in df[col].dropna().unique()[:5]
                ]
            }
            # Only calculate skewness for numerical columns
            if col in num_cols:
                col_info["skewness"] = float(df[col].skew())
            
            column_details.append(col_info)

        # 3. Construct the exact API Contract
        stats_df = df.describe()
        sample_df = df.sample(min(5, len(df)),random_state=42)
        
        summary = {
            "dataset_id": dataset_id,
            "metrics": {
                "rows": int(len(df)),
                "columns": int(len(df.columns)),
                "total_duplicates": int(df.duplicated().sum()),
                "total_missing": int(df.isnull().sum().sum()),
                "sentinel_dirty_values": count_sentinels(df)
            },
            "column_details": column_details,
            
            # Keeping your excellent additions for future use!
            "stats": json.loads(stats_df.to_json()),
            "sample_data": json.loads(sample_df.to_json(orient="records")),
            "correlation": corr,
            

        }
        
        return clean_dict(summary)
# report = DataAnalyzer()
# print(report.analyze_csv("c6663c09-c2f4-4610-8542-1b05e606e7df"))