from app.services.planner import AIPlanner
from fastapi import APIRouter, HTTPException
from app.services.analysis import DataAnalyzer

analyzer = DataAnalyzer()

planner_router = APIRouter(
    tags=["planner"]
)

@planner_router.post("/planner/{dataset_id}")
async def generate_cleaning_plan(dataset_id: str):
    try:
        report = analyzer.analyze_csv(dataset_id)
        planner = AIPlanner(report=report)
        response = await planner.generate_plan()
        return response
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
