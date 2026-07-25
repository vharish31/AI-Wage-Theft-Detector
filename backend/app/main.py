import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes import speech, detect, complaint, wage_theft, validate, ml_routes, hours, multi_job

load_dotenv()

app = FastAPI(
    title="AI Wage Theft Detector API",
    description="Backend service providing voice extraction, wage benchmarks, underpayment risk scoring, AI Wage Theft Analysis Engine, ML model predictions, smart hours estimation, multi-job workday support, and legal complaint generation.",
    version="1.3.0"
)

# Enable CORS for frontend web integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(speech.router)
app.include_router(detect.router)
app.include_router(complaint.router)
app.include_router(wage_theft.router)
app.include_router(validate.router)
app.include_router(ml_routes.router)
app.include_router(hours.router)
app.include_router(multi_job.router)







@app.get("/", tags=["Health Check"])
async def root():
    return {
        "status": "online",
        "app": "AI Wage Theft Detector API",
        "tagline": "Every Hour Counted. Every Rupee Protected.",
        "version": "1.0.0",
        "gemini_api_configured": bool(os.getenv("GEMINI_API_KEY"))
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
