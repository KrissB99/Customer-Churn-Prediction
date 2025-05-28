# database/models.py
from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class PredictionLog(Base):
    __tablename__ = 'predictions'
    id = Column(Integer, primary_key=True)
    tenure = Column(Integer)
    monthly_charges = Column(Float)
    contract = Column(String)
    internet_service = Column(String)
    probability = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

engine = create_engine('sqlite:///database/db.sqlite3')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
