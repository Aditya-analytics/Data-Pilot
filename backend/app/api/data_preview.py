from fastapi import APIRouter,HTTPException
from app.services.analysis import DataAnalyzer
import pandas as pd
import json

analyzer = DataAnalyzer()

preview_router = APIRouter(
    tags=["preview"]
)

@preview_router.get("/preview_data/{dataset_id}")
def sample_data(dataset_id:str):
   try:
        csv_file = analyzer.get_csv(dataset_id)
        df = pd.read_csv(csv_file)

        return json.loads(df.sample(10).to_json(orient="records"))
   
   except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
   except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
