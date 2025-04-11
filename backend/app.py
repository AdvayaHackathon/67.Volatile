from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import numpy as np
from sklearn.ensemble import IsolationForest
import json
from datetime import datetime, timedelta
import traceback
from document_processor import analyze_medical_reports
from chatbot import HealthChatbot
import pywhatkit as pwk
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv('CORS_ORIGIN', 'http://localhost:5173'),
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Initialize chatbot
chatbot = HealthChatbot()

# Initialize Isolation Forest model
iso_forest = IsolationForest(
    contamination=0.1,
    random_state=42,
    n_estimators=100,
    max_samples='auto'
)

def handle_error(e: Exception, status_code: int = 500):
    error_details = {
        'error': str(e),
        'type': type(e).__name__,
        'trace': traceback.format_exc()
    }
    print('Error:', error_details)
    return jsonify({
        'success': False,
        'error': str(e),
        'status': status_code
    }), status_code

def generate_realistic_ecg_data(num_points=100):
    timestamps = [datetime.now() - timedelta(seconds=i) for i in range(num_points)]
    timestamps.reverse()
    
    data = []
    for i, timestamp in enumerate(timestamps):
        t = i / 10
        p_wave = 0.25 * np.sin(t * np.pi * 2)
        if i % 10 == 0:
            qrs = 1.5
        elif i % 10 in [9]:
            qrs = -0.5
        elif i % 10 in [1]:
            qrs = -0.3
        else:
            qrs = 0
        t_wave = 0.35 * np.sin(t * np.pi * 1.5)
        value = p_wave + qrs + t_wave
        noise = np.random.normal(0, 0.05)
        value += noise
        
        data.append({
            'timestamp': int(timestamp.timestamp() * 1000),
            'value': float(value),
            'isAnomaly': False
        })
    
    return data

def generate_realistic_eeg_data(num_points=100):
    timestamps = [datetime.now() - timedelta(seconds=i) for i in range(num_points)]
    timestamps.reverse()
    
    data = []
    for i, timestamp in enumerate(timestamps):
        t = i / 10
        alpha = 0.5 * np.sin(t * 8) * (1 + 0.2 * np.sin(t * 0.5))
        beta = 0.3 * np.sin(t * 20) * (1 + 0.1 * np.sin(t * 0.3))
        theta = 0.4 * np.sin(t * 5) * (1 + 0.15 * np.sin(t * 0.4))
        delta = 0.6 * np.sin(t * 2) * (1 + 0.25 * np.sin(t * 0.2))
        noise = np.random.normal(0, 0.05)
        
        data.append({
            'timestamp': int(timestamp.timestamp() * 1000),
            'alpha': float(alpha + noise),
            'beta': float(beta + noise),
            'theta': float(theta + noise),
            'delta': float(delta + noise),
            'isAnomaly': False
        })
    
    return data

def detect_anomalies(data, feature_columns):
    try:
        features = np.array([[point[col] for col in feature_columns] for point in data])
        predictions = iso_forest.fit_predict(features)
        
        anomaly_indices = []
        for i, prediction in enumerate(predictions):
            is_anomaly = prediction == -1
            data[i]['isAnomaly'] = is_anomaly
            if is_anomaly:
                anomaly_indices.append(i)
        
        if anomaly_indices:
            for i in anomaly_indices:
                if i > 0 and i < len(data) - 1:
                    data[i]['anomalyContext'] = {
                        'previous': data[i-1],
                        'next': data[i+1],
                        'deviation': calculate_deviation(data[i], data[i-1:i+2], feature_columns)
                    }
        
        return data
    except Exception as e:
        print(f"Error in anomaly detection: {str(e)}")
        raise

def calculate_deviation(point, context, features):
    try:
        values = [p[features[0]] for p in context if features[0] in p]
        if not values:
            return 0
        mean = np.mean(values)
        std = np.std(values)
        if std == 0:
            return 0
        return abs(point[features[0]] - mean) / std
    except Exception as e:
        print(f"Error calculating deviation: {str(e)}")
        return 0

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data or 'message' not in data:
            return handle_error(ValueError("No message provided"), 400)
        
        response = chatbot.generate_response(
            data['message'],
            data.get('patientProfile')
        )
        
        return jsonify(response)
    except Exception as e:
        return handle_error(e)

@app.route('/api/analyze-health', methods=['POST'])
def analyze_health():
    try:
        data = request.json
        if not data:
            return handle_error(ValueError("No data provided"), 400)
        
        analysis = chatbot.analyze_health_data(
            data.get('vitals'),
            data.get('conditions'),
            data.get('medications')
        )
        
        return jsonify(analysis)
    except Exception as e:
        return handle_error(e)

@app.route('/api/sos', methods=['POST'])
def send_sos():
    try:
        phone_number = "+919906734598"
        message = "User has major health alerts, take action accordingly!"
        
        # Get current time and add 2 minutes to ensure message is sent
        now = datetime.now()
        time_hour = now.hour
        time_min = now.minute + 2  # Add 2 minutes to current time
        
        # Handle minute overflow
        if time_min >= 60:
            time_hour += 1
            time_min -= 60
        
        # Handle hour overflow
        if time_hour >= 24:
            time_hour = 0
            
        pwk.sendwhatmsg(phone_number, message, time_hour, time_min)
        
        return jsonify({
            'success': True,
            'message': 'SOS alert sent successfully'
        })
    except Exception as e:
        return handle_error(e)

@app.route('/api/ecg', methods=['GET'])
def get_ecg_data():
    try:
        ecg_data = generate_realistic_ecg_data()
        ecg_data = detect_anomalies(ecg_data, ['value'])
        return jsonify(ecg_data)
    except Exception as e:
        return handle_error(e)

@app.route('/api/eeg', methods=['GET'])
def get_eeg_data():
    try:
        eeg_data = generate_realistic_eeg_data()
        eeg_data = detect_anomalies(eeg_data, ['alpha', 'beta', 'theta', 'delta'])
        return jsonify(eeg_data)
    except Exception as e:
        return handle_error(e)

@app.route('/api/scan-documents', methods=['POST'])
def scan_documents():
    try:
        if 'documents' not in request.files:
            return handle_error(ValueError("No documents provided"), 400)
            
        files = request.files.getlist('documents')
        if not files:
            return handle_error(ValueError("No documents provided"), 400)
            
        # Save files temporarily and get their paths
        temp_paths = []
        for file in files:
            temp_path = f"/tmp/{file.filename}"
            file.save(temp_path)
            temp_paths.append(temp_path)
        
        # Process documents using the document processor
        try:
            results = analyze_medical_reports(temp_paths)
            return jsonify({
                'success': True,
                'results': results
            })
        finally:
            # Clean up temporary files
            for path in temp_paths:
                if os.path.exists(path):
                    os.remove(path)
                    
    except Exception as e:
        return handle_error(e)

if __name__ == '__main__':
    app.run(debug=True)