import google.generativeai as genai

# Replace with your actual API key
API_KEY = "AIzaSyAe6idUrm8K9TLIGMg9aDvA-OmaPoSDYK0"
genai.configure(api_key=API_KEY)

# Explicitly use API v1
model = genai.GenerativeModel(model_name="gemini-1.5-pro")

class HealthChatbot:
    def __init__(self):
        self.patient_profile = {
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

    def format_patient_data(self, profile):
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

    def generate_response(self, query, patient_profile=None):
        if patient_profile:
            self.patient_profile = patient_profile

        prompt = f"""
        Interact with the patient as a human for non-medical questions.
        Answer the following health-related question based on the patient's profile and health data, if asked:

        Question: {query}

        Patient Profile:
        {self.format_patient_data(self.patient_profile)}

        Provide a concise answer focusing on:
        1. Direct response to the question
        2. Relevant health insights from the data
        3. Personalized recommendations if applicable
        4. Any necessary precautions or warnings
        """
        try:
            response = model.generate_content(prompt)
            return {
                'success': True,
                'response': response.text
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def analyze_health_data(self, vitals=None, conditions=None, medications=None):
        if vitals:
            self.patient_profile['recent_vitals'].update(vitals)
        if conditions:
            self.patient_profile['known_conditions'] = conditions
        if medications:
            self.patient_profile['medications'] = medications

        prompt = f"""
        Analyze the patient's health data and provide insights:

        Patient Profile:
        {self.format_patient_data(self.patient_profile)}

        Provide a health analysis focusing on:
        1. Current health status
        2. Risk factors
        3. Recommended actions
        4. Areas of concern
        """
        try:
            response = model.generate_content(prompt)
            return {
                'success': True,
                'analysis': response.text
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }