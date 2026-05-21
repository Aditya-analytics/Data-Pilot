from fastapi import FastAPI, File, UploadFile, HTTPException, APIRouter
import csv
from io import StringIO
import shutil, os , uuid

csv_router = APIRouter(
    prefix="/upload",
    tags=["input_data"]
)
#------------ Create a file directory -------------
UPLOADED_DIR = "backend/uploads"
os.makedirs(UPLOADED_DIR,exist_ok=True)

@csv_router.post("/csv",status_code=201)
async def upload_csv(file : UploadFile = File(...)):
    # 1. Validate file type
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    dataset_id = str(uuid.uuid4())

    file_path = os.path.join(UPLOADED_DIR,f"{dataset_id}.csv")

    try:
        with open(file_path,"wb") as buffer:
            shutil.copyfileobj(file.file,buffer)

    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Unable to process csv due to {str(e)}")

    finally:
        await file.close()
    
    return {
        "dataset_id": dataset_id,
        "filename": file.filename, 
        "message": "File saved successfully"
    }





