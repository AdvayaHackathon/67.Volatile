import { useState, useEffect } from 'react';
import { healthAPI, VitalData } from '../util/api';

export const useECGData = () => {
  const [ecgData, setEcgData] = useState<VitalData[]>([]);
  const [ecgLoading, setEcgLoading] = useState<boolean>(true);
  const [ecgError, setEcgError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await healthAPI.getECGData();
        setEcgData(data);
        setEcgLoading(false);
      } catch (error) {
        console.error('Error fetching ECG data:', error);
        setEcgError('Failed to fetch ECG data');
        setEcgLoading(false);
      }
    };

    fetchData();

    // Update data every second
    const interval = setInterval(fetchData, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { ecgData, ecgLoading, ecgError };
};