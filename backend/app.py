from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
from utils.preprocess import preprocess_input
from database.models import Session, PredictionLog

app = FastAPI()

# Allow frontend on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup
model = joblib.load("model/churn_model.pkl")

# Request schema
class ChurnRequest(BaseModel):
    tenure: int
    monthly_charges: float
    contract: str
    internet_service: str

# Response schema
class ChurnResponse(BaseModel):
    probability: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=ChurnResponse)
def predict(req: ChurnRequest):
    print(req.dict())
    try:
        features = preprocess_input(req.dict())
        probability = model.predict_proba(features)[0][1]

        # Log to DB
        session = Session()
        log = PredictionLog(
            tenure=req.tenure,
            monthly_charges=req.monthly_charges,
            contract=req.contract,
            internet_service=req.internet_service,
            probability=probability
        )
        session.add(log)
        session.commit()
        session.close()

        return {"probability": probability}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
