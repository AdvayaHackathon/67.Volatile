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

// Mock data sets including normal readings
const mockAnomalySets = [
  [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'Combined',
      severity: 'high',
      description: 'Urgent: Multiple cardiovascular and neurological indicators detected',
      details: 'Analysis shows concurrent cardiac arrhythmia patterns and asymmetric neural activity. ST-segment elevation observed in ECG, accompanied by significant changes in delta wave patterns.',
      status: 'active',
      risks: [
        {
          type: 'Heart Attack',
          probability: 0.85,
          severity: 'high',
          indicators: [
            'ST-segment elevation of 2.3mm in leads V2-V4',
            'T-wave inversion in lateral leads',
            'Reduced R-wave progression',
            'Tachycardia with rate >120 bpm',
            'Irregular QRS complex morphology'
          ]
        },
        {
          type: 'Stroke',
          probability: 0.78,
          severity: 'high',
          indicators: [
            'Left hemispheric delta wave predominance',
            'Significant alpha wave suppression',
            'Focal theta wave bursts',
            'Asymmetric neural activity patterns',
            'Abnormal P300 response'
          ]
        }
      ]
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      type: 'ECG',
      severity: 'normal',
      description: 'Normal Sinus Rhythm',
      details: 'Regular heart rhythm with normal P waves, QRS complexes, and T waves. Heart rate within normal range.',
      status: 'normal',
      risks: [{
        type: 'Baseline Assessment',
        probability: 0.05,
        severity: 'normal',
        indicators: [
          'Regular RR intervals',
          'Normal P wave morphology',
          'Normal QRS duration',
          'Normal T wave orientation',
          'Heart rate 60-100 bpm'
        ]
      }]
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      type: 'EEG',
      severity: 'normal',
      description: 'Normal Brain Wave Patterns',
      details: 'Well-organized alpha rhythm with appropriate beta, theta, and delta distributions. No abnormal waveforms or asymmetries.',
      status: 'normal',
      risks: [{
        type: 'Baseline Assessment',
        probability: 0.03,
        severity: 'normal',
        indicators: [
          'Dominant posterior alpha rhythm',
          'Normal beta activity during tasks',
          'Appropriate theta distribution',
          'Expected delta presence',
          'Symmetric hemispheric patterns'
        ]
      }]
    }
  ],
  [
    {
      id: '4',
      timestamp: new Date().toISOString(),
      type: 'EEG',
      severity: 'high',
      description: 'Critical: Pre-seizure Pattern Detected',
      details: 'Sudden onset of high-frequency beta activity followed by rhythmic sharp waves in the temporal region. Pattern suggests imminent seizure risk.',
      status: 'active',
      risks: [{
        type: 'Seizure',
        probability: 0.91,
        severity: 'high',
        indicators: [
          'Rhythmic sharp waves in temporal lobe',
          'High-frequency beta activity bursts',
          'Focal spike-wave complexes',
          'Suppression of normal background rhythm',
          'Progressive amplitude increase'
        ]
      }]
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      type: 'ECG',
      severity: 'normal',
      description: 'Healthy Cardiac Function',
      details: 'Normal cardiac rhythm and conduction patterns. All parameters within healthy ranges.',
      status: 'normal',
      risks: [{
        type: 'Baseline Assessment',
        probability: 0.04,
        severity: 'normal',
        indicators: [
          'Normal sinus rhythm',
          'Regular heart rate',
          'Normal QRS morphology',
          'Normal ST segments',
          'Regular P waves'
        ]
      }]
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      type: 'Combined',
      severity: 'normal',
      description: 'Optimal Cardio-Neurological Function',
      details: 'Synchronized cardiac and neural patterns indicating healthy physiological state.',
      status: 'normal',
      risks: [{
        type: 'Baseline Assessment',
        probability: 0.02,
        severity: 'normal',
        indicators: [
          'Coordinated heart-brain interaction',
          'Normal autonomic balance',
          'Healthy stress response',
          'Regular sleep-wake patterns',
          'Normal cognitive function indicators'
        ]
      }]
    }
  ],
  [
    {
      id: '7',
      timestamp: new Date().toISOString(),
      type: 'ECG',
      severity: 'high',
      description: 'Acute Myocardial Ischemia Pattern',
      details: 'Significant ST-segment elevation in anterior leads with reciprocal changes. Pattern indicates acute anterior wall myocardial ischemia.',
      status: 'active',
      risks: [{
        type: 'Myocardial Infarction',
        probability: 0.88,
        severity: 'high',
        indicators: [
          'ST elevation >2mm in V2-V4',
          'Reciprocal ST depression in II, III, aVF',
          'Hyperacute T waves',
          'Loss of R wave progression',
          'New Q waves developing'
        ]
      }]
    },
    {
      id: '8',
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      type: 'EEG',
      severity: 'normal',
      description: 'Normal Neural Activity',
      details: 'Well-regulated brain activity with appropriate wave patterns across all frequency bands.',
      status: 'normal',
      risks: [{
        type: 'Baseline Assessment',
        probability: 0.03,
        severity: 'normal',
        indicators: [
          'Normal alpha rhythm',
          'Appropriate beta activity',
          'Regular theta patterns',
          'Expected delta waves',
          'Balanced hemispheric activity'
        ]
      }]
    },
    {
      id: '9',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      type: 'Combined',
      severity: 'normal',
      description: 'Stable Physiological State',
      details: 'Harmonious interaction between cardiac and neural systems indicating good health status.',
      status: 'normal',
      risks: [{
        type: 'Baseline Assessment',
        probability: 0.02,
        severity: 'normal',
        indicators: [
          'Normal heart rate variability',
          'Balanced autonomic function',
          'Regular breathing patterns',
          'Normal cognitive processing',
          'Healthy stress response'
        ]
      }]
    }
  ]
];

export const useAnomalies = () => {
  const { ecgData } = useECGData();
  const { eegData } = useEEGData();
  const [anomalies, setAnomalies] = useState<Anomaly[]>(mockAnomalySets[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mockSetIndex, setMockSetIndex] = useState(0);

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
      
      setAnomalies(mockAnomalySets[mockSetIndex]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      setError('Failed to detect anomalies');
      setLoading(false);
    }
  }, [ecgData, eegData, mockSetIndex]);

  const refresh = async () => {
    setMockSetIndex((prevIndex) => (prevIndex + 1) % mockAnomalySets.length);
    await detectAnomalies();
  };

  return { anomalies, loading, error, refresh };
};