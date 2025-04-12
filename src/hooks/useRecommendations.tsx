import { useState, useEffect, useCallback } from 'react';
import { useAnomalies } from './useAnomalies';

interface Recommendation {
  id: string;
  timestamp: string;
  category: 'Cardiac' | 'Neurological' | 'Combined';
  title: string;
  description: string;
  recommendations: string[];
  source: string;
  confidence: number;
}

// Mock recommendation sets for when LLM fails
const mockRecommendationSets = [
  [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      category: 'Combined',
      title: 'Urgent: Cardio-Neurological Risk Management',
      description: 'Multiple high-risk indicators detected in both cardiac and neural patterns requiring immediate attention and intervention.',
      recommendations: [
        'Seek emergency medical attention immediately - Call emergency services or proceed to nearest ER',
        'Take prescribed nitroglycerin if available and as directed by physician',
        'Assume semi-reclined position to optimize cerebral blood flow',
        'Monitor and record vital signs every 15 minutes if possible',
        'Avoid any physical exertion or stress',
        'Ensure clear airway and breathing',
        'Have someone stay with you until medical help arrives'
      ],
      source: 'Emergency Cardiology & Neurology Protocols 2025',
      confidence: 0.95
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      category: 'Cardiac',
      title: 'Arrhythmia Management Protocol',
      description: 'Detected irregular heart rhythm patterns suggest need for immediate rhythm management intervention.',
      recommendations: [
        'Schedule urgent consultation with cardiac electrophysiologist',
        'Continue current anti-arrhythmic medications as prescribed',
        'Monitor pulse rate and rhythm every 2 hours',
        'Maintain detailed log of palpitation episodes',
        'Avoid caffeine and other stimulants',
        'Practice guided breathing exercises (5-5-5 technique)',
        'Ensure adequate electrolyte balance with prescribed supplements'
      ],
      source: 'Cardiac Rhythm Management Guidelines 2025',
      confidence: 0.88
    }
  ],
  [
    {
      id: '3',
      timestamp: new Date().toISOString(),
      category: 'Neurological',
      title: 'Critical: Seizure Prevention Protocol',
      description: 'Pre-seizure patterns detected requiring immediate preventive measures and safety preparations.',
      recommendations: [
        'Move to a safe area away from hazards',
        'Take prescribed anti-epileptic medication if available',
        'Activate seizure response device if equipped',
        'Ensure someone is nearby for monitoring',
        'Document time and duration of any episodes',
        'Avoid bright lights and loud sounds',
        'Maintain clear airway access'
      ],
      source: 'International Epilepsy Management Guidelines 2025',
      confidence: 0.92
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      category: 'Combined',
      title: 'Stress-Related Health Management',
      description: 'Detected patterns indicate significant stress impact on cardiovascular and neurological systems.',
      recommendations: [
        'Initiate prescribed anti-anxiety protocol if available',
        'Practice progressive muscle relaxation technique',
        'Monitor heart rate variability using provided device',
        'Maintain regular deep breathing exercises',
        'Consider temporary stress leave from work',
        'Schedule follow-up with stress management specialist',
        'Review and adjust current medications with physician'
      ],
      source: 'Integrated Stress Management Protocol 2025',
      confidence: 0.85
    }
  ],
  [
    {
      id: '5',
      timestamp: new Date().toISOString(),
      category: 'Cardiac',
      title: 'Acute Coronary Syndrome Protocol',
      description: 'ECG patterns indicate potential acute myocardial ischemia requiring immediate intervention.',
      recommendations: [
        'Call emergency services immediately (911/112)',
        'Take aspirin 325mg if not contraindicated',
        'Rest in semi-recumbent position',
        'Prepare list of current medications',
        'Have someone stay with you until EMS arrives',
        'Avoid eating or drinking',
        'Keep nitroglycerin readily accessible if prescribed'
      ],
      source: 'AHA Emergency Cardiac Care Guidelines 2025',
      confidence: 0.94
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      category: 'Neurological',
      title: 'Stroke Prevention Protocol',
      description: 'Neural patterns suggest increased risk of cerebral ischemia requiring immediate preventive measures.',
      recommendations: [
        'Activate stroke response protocol immediately',
        'Check blood pressure if monitoring equipment available',
        'Document time of first symptoms',
        'Perform FAST assessment (Face, Arms, Speech, Time)',
        'Avoid food and drink until medical evaluation',
        'Maintain upright or slightly reclined position',
        'Prepare medical history for emergency responders'
      ],
      source: 'Stroke Prevention and Management Guidelines 2025',
      confidence: 0.89
    }
  ]
];

export const useRecommendations = () => {
  const { anomalies } = useAnomalies();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mockSetIndex, setMockSetIndex] = useState(0);

  const generateRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      
      // In a real application, we would use the LLM here
      // For now, we'll use mock data sets
      setRecommendations(mockRecommendationSets[mockSetIndex]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setLoading(false);
    }
  }, [mockSetIndex]);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  const refresh = async () => {
    setMockSetIndex((prevIndex) => (prevIndex + 1) % mockRecommendationSets.length);
    await generateRecommendations();
  };

  return { recommendations, loading, refresh };
};