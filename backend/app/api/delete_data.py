from fastapi import APIRouter,HTTPException
import os

UPLOADED_DIR = "backend/uploads"

rm_file_router=APIRouter(
    tags=["new_project"]
)

@rm_file_router.delete("/remove_file/{dataset_id}",status_code=204)
def remove_file(dataset_id:str):
    original_file = f"{UPLOADED_DIR}/{dataset_id}.csv"
    cleaned_file = f"{UPLOADED_DIR}/{dataset_id}_cleaned.csv"

    if not os.path.exists(original_file):
        print("Original file not found")
        raise HTTPException(status_code=404, detail="Original file not found!")
    
    try:
        print("Removing original file 📂...")
        os.remove(original_file)
        print("Removed original file ✅")

        # Safely try to remove cleaned file ONLY if it exists
        if os.path.exists(cleaned_file):
            print("Removing cleaned file 📂...")
            os.remove(cleaned_file)
            print("Removed cleaned file ✅")
        else:
            print("No cleaned file to remove, skipping.")

    except Exception as e:
        print(f"An unexpected exception {e} occured")
        raise e
    
    

