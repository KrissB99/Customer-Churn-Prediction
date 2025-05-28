# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from utils.preprocess import preprocess_input
from database.models import Session, PredictionLog

app = Flask(__name__)
CORS(app)

# Load model at startup
model = joblib.load('model/churn_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        X = preprocess_input(data)
        probability = model.predict_proba(X)[0][1]

        # Log to DB
        session = Session()
        log = PredictionLog(
            tenure=int(data['tenure']),
            monthly_charges=float(data['monthly_charges']),
            contract=data['contract'],
            internet_service=data['internet_service'],
            probability=probability
        )
        session.add(log)
        session.commit()
        session.close()

        return jsonify({'probability': probability})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health')
def health():
    return "OK", 200

if __name__ == '__main__':
    app.run(debug=True)
