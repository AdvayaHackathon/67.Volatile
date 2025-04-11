from annotated_types import LowerCase
import google.generativeai as genai

# Replace with your actual API key
API_KEY = "AIzaSyAe6idUrm8K9TLIGMg9aDvA-OmaPoSDYK0"
genai.configure(api_key=API_KEY)

# Explicitly use API v1
model = genai.GenerativeModel(model_name="gemini-1.5-pro")

# Sample patient data (unchanged)
patient_profile = {
    "age": 45,
    "gender": "Male",
    "weight": "82kg",
    "known_conditions": ["Type 2 Diabetes", "Hypertension"],
    "recent_vitals": {
        "blood_pressure": "145/90",
        "glucose_level": "160 mg/dL",
        "heart_rate": "88 bpm"
    }
}

def format_patient_data(profile):
    vitals = profile["recent_vitals"]
    return f"""
Age: {profile['age']}
Gender: {profile['gender']}
Weight: {profile['weight']}
Known Conditions: {", ".join(profile['known_conditions'])}
Recent Vitals:
  - Blood Pressure: {vitals['blood_pressure']}
  - Glucose Level: {vitals['glucose_level']}
  - Heart Rate: {vitals['heart_rate']}
"""

def generate_health_response(query):
    prompt = f"""
    Interact with the patient as a human for non-medical questions.
    Answer the following health-related question based on the patient's profile and health data, if asked:

    Question: {query}

    Patient Profile:
    {format_patient_data(patient_profile)}

    Provide a concise answer focusing on:
    1. Direct response to the question
    2. Relevant health insights from the data
    3. Personalized recommendations if applicable
    4. Any necessary precautions or warnings
    """
    try:
        response = model.generate_content(prompt)
        print("HealthBot Response:\n")
        print(response.text)
    except Exception as e:
        print("Error occurred:")
        print(e)

# Test
question = ""
while(question != "stop"):
    question = input("Question:")
    generate_health_response(question)
