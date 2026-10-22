from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.core.database import db_manager
from app.api.v1.api_router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    try:
        db_manager.connect_to_database()
        print("Connected to MongoDB successfully.")
    except Exception as e:
        print(f"Warning: Could not connect to MongoDB at startup: {e}")
    yield
    # Shutdown: Close DB connection
    db_manager.close_database_connection()
    print("Closed MongoDB connection.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Chakravyuh - Enterprise Automated Interview Scheduling & Optimization Engine with Google OR-Tools CP-SAT",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Chakravyuh Backend",
        "version": "0.1.0",
        "solver": "Google OR-Tools CP-SAT",
    }


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to Chakravyuh Optimization API",
        "docs": "/docs",
        "api_v1": settings.API_V1_PREFIX,
    }
