import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Form, Body
from typing import Dict, Any
from ocr import perform_ocr
from parser import parser, parser_csv
import os
import zipfile
import json
from log import log
from piccolo_conf import Suggestions, DB
from contextlib import asynccontextmanager

# -------- Configuration --------
class ConfigLoader:
    """Utility to load JSON configuration."""
    @staticmethod
    def load(file_path: str) -> Dict[str, Any]:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: Configuration file {file_path} not found.")
        except json.JSONDecodeError:
            print(f"Error: Failed to parse {file_path}. Ensure it is valid JSON.")
        return {}

CONFIG = ConfigLoader.load("config.json")

# -------- App Initialization --------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage app startup and shutdown tasks."""
    try:
        await DB.start_connection_pool()
        log.info("Database connection initialized.")
        await Suggestions.create_table(if_not_exists=True)
        log.info("Database tables ensured.")
        yield
    finally:
        await DB.close_connection_pool()
        log.info("Database connection closed.")

app = FastAPI(lifespan=lifespan)

# -------- Utility Functions --------
def save_upload_file_sync(file: UploadFile, destination: str) -> None:
    """Save uploaded file synchronously."""
    with open(destination, "wb") as out_file:
        out_file.write(file.file.read())
    log.info(f"File saved to {destination}")

def delete_file(file_path: str) -> None:
    """Delete file if it exists."""
    if os.path.exists(file_path):
        os.remove(file_path)
        log.info(f"File {file_path} deleted.")

def extract_zip_with_password(file_path: str, output_dir: str, password: str) -> str:
    """Extract a zip file with a password."""
    try:
        with zipfile.ZipFile(file_path) as zip_file:
            zip_list = zip_file.namelist()
            zip_file.extract(zip_list[0], output_dir, pwd=password.encode("utf-8"))
            return zip_list[0]
    except zipfile.BadZipFile:
        log.error("Invalid ZIP file.")
        raise HTTPException(status_code=400, detail="Invalid ZIP file.")
    except RuntimeError as e:
        if "Bad password" in str(e):
            log.error("Incorrect password.")
            raise HTTPException(status_code=403, detail="Incorrect password.")
        raise
    except Exception as e:
        log.error(f"Unknown error: {e}")
        raise HTTPException(status_code=500, detail="An unknown error occurred.")

# -------- API Routes --------
@app.get(f"/api/{CONFIG.get('API_VERSION')}")
async def read_root():
    """Root endpoint."""
    log.info("Handling root request.")
    return {"message": "Welcome to the API"}

@app.get(f"/api/{CONFIG.get('API_VERSION')}/update")
async def update_info():
    """Fetch update information."""
    log.info("Fetching update information.")
    return {
        "version": CONFIG.get("APP_VERSION"),
        "forceUpdate": CONFIG.get("APP_FORCE_UPDATE"),
        "updateLogs": CONFIG.get("APP_UPDATE_LOG"),
        "link": CONFIG.get("APP_UPDATE_LINK"),
    }

@app.post(f"/api/{CONFIG.get('API_VERSION')}/suggestions")
async def submit_suggestion(text: str = Body(...)):
    """Submit a suggestion."""
    log.info(f"Received suggestion: {text}")
    try:
        await Suggestions(suggestions=text).save()
        log.info("Suggestion saved to database.")
        return {"code": 200, "msg": "反馈成功～"}
    except Exception as e:
        log.error(f"Error saving suggestion: {e}")
        raise HTTPException(status_code=500, detail="Failed to save suggestion.")

@app.get(f"/api/{CONFIG.get('API_VERSION')}/suggestions")
async def fetch_suggestions():
    """Fetch all suggestions."""
    log.info("Fetching all suggestions.")
    try:
        suggestions = await Suggestions.select().order_by(Suggestions.ctime, ascending=False).run()
        return {"code": 200, "data": suggestions}
    except Exception as e:
        log.error(f"Error fetching suggestions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch suggestions.")

@app.post(f"/api/{CONFIG.get('API_VERSION')}/upload")
async def process_upload(file: UploadFile = File(...)):
    """Process a single file for OCR."""
    file_location = f"/tmp/{file.filename}"
    try:
        save_upload_file_sync(file, file_location)
        ocr_result = perform_ocr(file_location)
        parsed_result = parser(ocr_result)
        log.info(f"OCR result: {ocr_result}")
        log.info(f"Parsed result: {parsed_result}")
        return parsed_result
    except Exception as e:
        log.error(f"Error processing file {file.filename}: {e}")
        raise HTTPException(status_code=500, detail="Failed to process file.")
    finally:
        delete_file(file_location)

@app.post(f"/api/{CONFIG.get('API_VERSION')}/batch/upload")
async def process_batch_upload(file: UploadFile = File(...), password: str = Form(...)):
    """Process a batch upload (ZIP with password)."""
    file_location = f"/tmp/{file.filename}"
    try:
        save_upload_file_sync(file, file_location)
        extracted_filename = extract_zip_with_password(file_location, "/tmp", password)
        parsed_result = parser_csv(f"/tmp/{extracted_filename}")
        log.info(f"Parsed batch result: {parsed_result}")
        return parsed_result
    except Exception as e:
        log.error(f"Error processing batch file {file.filename}: {e}")
        raise HTTPException(status_code=500, detail="Failed to process batch file.")
    finally:
        delete_file(file_location)

@app.get(f"/api/{CONFIG.get('API_VERSION')}/get-client-ip")
async def get_client_ip(request: Request):
    """Fetch client IP address."""
    ip = request.headers.get("X-Forwarded-For", request.client.host).split(",")[0]
    log.info(f"Client IP: {ip}")
    return {"client_ip": ip}

# -------- Main --------
if __name__ == "__main__":
    uvicorn.run(app, host=CONFIG.get("API_HOST", "0.0.0.0"), port=CONFIG.get("API_PORT", 8000))
