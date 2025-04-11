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

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    category: 'Cardiac',
    title: 'Urgent: Blood Pressure Management',
    description: 'Based on recent high blood pressure readings and irregular heart rhythm, immediate action is recommended.',
    recommendations: [
      'Take prescribed blood pressure medication immediately',
      'Rest in a quiet, dark room for 30 minutes',
      'Monitor blood pressure every 15 minutes',
      'Contact emergency services if systolic pressure exceeds 180 mmHg',
      'Avoid caffeine and stimulants'
    ],
    source: 'American Heart Association Guidelines 2025',
    confidence: 0.92
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    category: 'Neurological',
    title: 'Seizure Prevention Protocol',
    description: 'Due to detected abnormal brain wave patterns, preventive measures are recommended.',
    recommendations: [
      'Take anti-epileptic medication as prescribed',
      'Avoid bright, flashing lights',
      'Ensure adequate sleep (7-8 hours)',
      'Practice stress reduction techniques',
      'Keep a seizure diary'
    ],
    source: 'Neurological Care Protocol 2025',
    confidence: 0.85
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    category: 'Combined',
    title: 'Stress Management Plan',
    description: 'Integrated approach to managing stress-related cardiovascular and neurological symptoms.',
    recommendations: [
      'Practice deep breathing exercises 3 times daily',
      'Maintain regular sleep schedule',
      'Engage in light physical activity',
      'Follow Mediterranean diet guidelines',
      'Schedule regular check-ups'
    ],
    source: 'Integrative Medicine Guidelines 2025',
    confidence: 0.78
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    category: 'Cardiac',
    title: 'Heart Health Optimization',
    description: 'Long-term cardiovascular health maintenance program.',
    recommendations: [
      'Continue daily aspirin regimen as prescribed',
      'Monitor blood pressure twice daily',
      'Limit sodium intake to <2000mg daily',
      'Exercise 30 minutes, 5 days per week',
      'Regular cardiology follow-up'
    ],
    source: 'Cardiovascular Health Protocol 2025',
    confidence: 0.88
  }
];

export const useRecommendations = () => {
  const { anomalies } = useAnomalies();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const generateRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setRecommendations(mockRecommendations);
      setLoading(false);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  const refresh = async () => {
    await generateRecommendations();
  };

  return { recommendations, loading, refresh };
};