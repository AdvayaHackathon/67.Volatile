import { GoogleGenerativeAI } from '@google/generative-ai';
import { healthDataService } from './supabase';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Mock responses based on patient profile
const mockResponses = {
  medication: {
    lisinopril: "Lisinopril (10mg daily) is effectively managing your blood pressure. Current readings of 120/80 mmHg are within optimal range. Continue monitoring for any side effects.",
    aspirin: "Low-dose Aspirin (81mg daily) is appropriate for cardiovascular prevention given your family history. Regular use shows no concerning interactions with your other medications.",
    general: "Your current medication regimen appears well-tolerated with no significant interactions. Regular monitoring is in place."
  },
  vitals: {
    normal: "Your vital signs are within normal ranges:\n- Heart rate: 72 bpm (normal: 60-100)\n- Blood pressure: 120/80 mmHg (optimal)\n- Temperature: 36.6°C (normal)\n- O₂ Saturation: 98% (excellent)",
    concerns: "While your vitals are generally stable, we should monitor your blood pressure closely given your family history."
  },
  lifestyle: {
    exercise: "Given your controlled blood pressure, moderate exercise is beneficial. Aim for:\n- 30 minutes of aerobic activity 5 days/week\n- Start with walking or swimming\n- Monitor heart rate during exercise\n- Stay well-hydrated",
    diet: "Your current health profile suggests focusing on:\n- Low sodium diet (<2,300mg/day)\n- Rich in fruits and vegetables\n- Whole grains\n- Lean proteins\n- Limited processed foods"
  }
};

export async function generateHealthResponse(
  query: string,
  patientProfile: any
): Promise<string> {
  try {
    // Simulate response generation based on query content
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('medication') || queryLower.includes('lisinopril') || queryLower.includes('aspirin')) {
      if (queryLower.includes('lisinopril')) {
        return mockResponses.medication.lisinopril;
      }
      if (queryLower.includes('aspirin')) {
        return mockResponses.medication.aspirin;
      }
      return mockResponses.medication.general;
    }
    
    if (queryLower.includes('vital') || queryLower.includes('heart rate') || queryLower.includes('blood pressure')) {
      return mockResponses.vitals.normal + "\n\n" + mockResponses.vitals.concerns;
    }
    
    if (queryLower.includes('exercise') || queryLower.includes('physical activity')) {
      return mockResponses.lifestyle.exercise;
    }
    
    if (queryLower.includes('diet') || queryLower.includes('food') || queryLower.includes('eat')) {
      return mockResponses.lifestyle.diet;
    }

    // Default response incorporating patient data
    return `Based on your current health profile:\n\n` +
           `- Your blood pressure is well-controlled with Lisinopril\n` +
           `- Cardiovascular risk is being managed with preventive measures\n` +
           `- Regular monitoring and lifestyle modifications are key\n\n` +
           `Please be more specific with your question for detailed recommendations.`;

  } catch (error) {
    console.error('Error generating health response:', error);
    throw error;
  }
}

export async function analyzeHealthData(
  ecgData: any,
  eegData: any,
  previousAnomalies: any[]
): Promise<any> {
  try {
    const prompt = `
      Analyze the following health data and provide insights:
      ECG Data: ${JSON.stringify(ecgData)}
      EEG Data: ${JSON.stringify(eegData)}
      Previous Anomalies: ${JSON.stringify(previousAnomalies)}

      Provide analysis in JSON format with:
      1. Anomalies detected
      2. Risk assessment
      3. Recommendations
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text());

    // Store anomalies in Supabase
    for (const anomaly of analysis.anomalies) {
      await healthDataService.storeAnomaly({
        type: anomaly.type,
        data: { ecg: ecgData, eeg: eegData },
        severity: anomaly.severity,
        description: anomaly.description,
        status: anomaly.status,
        indicators: anomaly.risks?.map(risk => risk.type) || []
      });
    }

    return analysis;
  } catch (error) {
    console.error('Error analyzing health data:', error);
    throw error;
  }
}

export async function predictHealthConditions(
  anomalies: any[],
  patientProfile: any
): Promise<any> {
  try {
    const prompt = `
      Based on the following health data and patient profile, predict future health conditions:

      Patient Profile:
      ${JSON.stringify(patientProfile)}

      Health Anomalies:
      ${JSON.stringify(anomalies)}

      Provide predictions in JSON format with:
      1. Short-term predictions (6 months)
      2. Long-term predictions (2-5 years)
      3. Risk factors
      4. Preventive measures
      5. Warning signs to monitor
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const predictions = JSON.parse(response.text());

    // Store predictions in Supabase
    await Promise.all([
      healthDataService.storePrediction({
        anomaly_id: anomalies[0]?.id,
        prediction_type: 'short_term',
        prediction_data: predictions.shortTerm,
        confidence: 0.85
      }),
      healthDataService.storePrediction({
        anomaly_id: anomalies[0]?.id,
        prediction_type: 'long_term',
        prediction_data: predictions.longTerm,
        confidence: 0.75
      }),
      healthDataService.storePrediction({
        anomaly_id: anomalies[0]?.id,
        prediction_type: 'risk_analysis',
        prediction_data: {
          risks: predictions.risks,
          preventiveMeasures: predictions.preventiveMeasures,
          warningSignals: predictions.warningSignals
        },
        confidence: 0.80
      })
    ]);

    return predictions;
  } catch (error) {
    console.error('Error predicting health conditions:', error);
    throw error;
  }
}