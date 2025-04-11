import { useState, useCallback } from 'react';
import { useECGData } from './useECGData';
import { useEEGData } from './useEEGData';
import { analyzeHealthData } from '../services/gemini';

interface Anomaly {
  id: string;
  timestamp: string;
  type: 'ECG' | 'EEG' | 'Combined';
  severity: 'low' | 'medium' | 'high' | 'normal';
  description: string;
  details: string;
  status: 'active' | 'resolved' | 'normal';
  risks?: Array<{
    type: string;
    probability: number;
    severity: string;
    indicators: string[];
  }>;
}

const mockAnomalies: Anomaly[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    type: 'Combined',
    severity: 'high',
    description: 'Critical: Elevated Blood Pressure with Irregular Heart Rhythm',
    details: 'Blood pressure reading of 180/110 mmHg detected alongside irregular heart rhythm patterns. ECG shows premature ventricular contractions.',
    status: 'active',
    risks: [
      {
        type: 'Hypertensive Crisis',
        probability: 0.85,
        severity: 'high',
        indicators: [
          'Systolic pressure > 180 mmHg',
          'Diastolic pressure > 110 mmHg',
          'Irregular heart rhythm',
          'Reported headache',
          'Visual disturbances'
        ]
      }
    ]
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: 'EEG',
    severity: 'medium',
    description: 'Abnormal Brain Wave Patterns Detected',
    details: 'Unusual spike-wave discharges observed in temporal lobe region. Pattern suggests increased neurological activity.',
    status: 'active',
    risks: [
      {
        type: 'Seizure Risk',
        probability: 0.65,
        severity: 'medium',
        indicators: [
          'Spike-wave discharges',
          'Temporal lobe activity',
          'Altered consciousness',
          'Previous history'
        ]
      }
    ]
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: 'ECG',
    severity: 'low',
    description: 'Minor Heart Rate Variability',
    details: 'Slight variations in heart rate detected during rest period. May indicate stress or anxiety.',
    status: 'resolved',
    risks: [
      {
        type: 'Stress Response',
        probability: 0.45,
        severity: 'low',
        indicators: [
          'Variable heart rate',
          'Elevated cortisol',
          'Reported stress'
        ]
      }
    ]
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    type: 'Combined',
    severity: 'normal',
    description: 'Normal Vital Signs',
    details: 'All vital signs within normal ranges. Regular heart rhythm and normal brain wave patterns observed.',
    status: 'normal',
    risks: [
      {
        type: 'Routine Monitoring',
        probability: 0.1,
        severity: 'normal',
        indicators: [
          'Normal heart rate',
          'Regular rhythm',
          'Normal blood pressure',
          'Standard brain wave patterns'
        ]
      }
    ]
  }
];

export const useAnomalies = () => {
  const { ecgData } = useECGData();
  const { eegData } = useEEGData();
  const [anomalies, setAnomalies] = useState<Anomaly[]>(mockAnomalies);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const detectAnomalies = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to get analysis from LLM
      try {
        const analysis = await analyzeHealthData(ecgData, eegData, []);
        if (analysis && analysis.anomalies) {
          setAnomalies(analysis.anomalies);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('LLM analysis failed, using mock data:', error);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnomalies(mockAnomalies);
      
      setLoading(false);
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      setError('Failed to detect anomalies');
      setLoading(false);
    }
  }, [ecgData, eegData]);

  const refresh = async () => {
    await detectAnomalies();
  };

  return { anomalies, loading, error, refresh };
};