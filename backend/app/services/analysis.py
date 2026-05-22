import os
import math
import pandas as pd
import json

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

class DataAnalyzer:
    def __init__(self):
        self.upload_dir = "backend/uploads"

    def get_csv(self, dataset_id: str) -> str:
        csv_file = os.path.join(f"{self.upload_dir}/{dataset_id}.csv")

        if not os.path.exists(csv_file):
            raise FileNotFoundError(f"Dataset {dataset_id} does not exist.")
        
        return csv_file
    
    def analyze_csv(self, dataset_id: str) -> dict:
        file = self.get_csv(dataset_id)
        df = pd.read_csv(file)

        # 1. Safely extract JSON-serializable dictionaries
        null_counts = df.isnull().sum().to_dict()
        data_types = df.dtypes.astype(str).to_dict()
        num_cols = df.select_dtypes(include=['number']).columns.tolist()
        
        corr_df = df[num_cols].corr()
        corr = json.loads(corr_df.to_json())

        # 2. Build explicit column details list
        column_details = []
        for col in df.columns:
            column_details.append({
                "name": col,
                "type": data_types[col],
                "missing_count": int(null_counts[col])
            })

        # 3. Construct the exact API Contract
        stats_df = df.describe()
        sample_df = df.sample(min(5, len(df)))
        
        summary = {
            "dataset_id": dataset_id,
            "metrics": {
                "rows": int(len(df)),
                "columns": int(len(df.columns)),
                "total_duplicates": int(df.duplicated().sum()),
                "total_missing": int(df.isnull().sum().sum())
            },
            "column_details": column_details,
            
            # Keeping your excellent additions for future use!
            "stats": json.loads(stats_df.to_json()),
            "sample_data": json.loads(sample_df.to_json(orient="records")),
            "correlation": corr
        }
        
        return clean_dict(summary)
# report = DataAnalyzer()
# print(report.analyze_csv("c6663c09-c2f4-4610-8542-1b05e606e7df"))