from app.services.analysis import DataAnalyzer
from fastapi import HTTPException, APIRouter

analyzer = DataAnalyzer()

analyze_router = APIRouter(
    tags=["analysis"]
)

@analyze_router.get("/analysis/{dataset_id}")
def analysis(dataset_id: str):
    try:
        report = analyzer.analyze_csv(dataset_id)
        return report
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal analysis error")


