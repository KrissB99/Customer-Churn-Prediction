# Churn Insight – Customer Churn Prediction App

This full-stack app lets you enter customer data and receive churn probability predictions using a trained machine learning model.

Built with:

- **Flask** + **scikit-learn** (Backend)
- **Next.js** + **Tailwind CSS** (Frontend)
- **Docker** + **docker-compose**

---

## Quick Start (Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/KrissB99/Customer-Churn-Prediction.git
cd Customer-Churn-Prediction
```

### 2. Train the Model (If Not Done Yet)

Inside backend/ run:

```bash
python3 model/train_model.py
```

### 3. Build and Run Containers

```bash
docker-compose up --build
```

Frontend runs on: [http://localhost:3000](http://localhost:3000)

Backend API runs on: [http://localhost:5000](http://localhost:5000/docs#)

### 4. API Example

POST /predict

```json
{
  "tenure": 12,
  "monthly_charges": 65.3,
  "contract": "Month-to-month",
  "internet_service": "DSL"
}
```

response

```json
{
  "probability": 0.76
}
```

### 5. Folder Structure

```vbnet
churn-insight/
├── backend/   ← Flask app with ML model
├── frontend/  ← Next.js UI
├── docker-compose.yml
└── README.md
```

### 6. App View

![Main App View](/pictures/Screenshot%202025-05-28%20at%2013.45.39.png)

Copyright @2025 - Krystyna Banaszewska
