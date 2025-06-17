import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression

# Load dataset (local file)
df = pd.read_csv("model/data.csv")

# Clean data
df = df[df['TotalCharges'].notnull()]
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df.dropna(inplace=True)

# Select relevant columns for your form
df = df[['tenure', 'MonthlyCharges', 'Contract', 'InternetService', 'Churn']]

# Encode target + categorical features
df['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})
df['Contract'] = LabelEncoder().fit_transform(df['Contract'])
df['InternetService'] = LabelEncoder().fit_transform(df['InternetService'])

# Train/test split
X = df.drop('Churn', axis=1)
y = df['Churn']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, 'model/churn_model.pkl')
print("✅ Model trained and saved as churn_model.pkl")
