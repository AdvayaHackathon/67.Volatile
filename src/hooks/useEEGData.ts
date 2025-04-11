import { useState, useEffect } from 'react';
import { healthAPI, EEGData } from '../util/api';

export const useEEGData = () => {
  const [eegData, setEegData] = useState<EEGData[]>([]);
  const [eegLoading, setEegLoading] = useState<boolean>(true);
  const [eegError, setEegError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await healthAPI.getEEGData();
        setEegData(data);
        setEegLoading(false);
      } catch (error) {
        console.error('Error fetching EEG data:', error);
        setEegError('Failed to fetch EEG data');
        setEegLoading(false);
      }
    };

    fetchData();

    // Update data every second
    const interval = setInterval(fetchData, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { eegData, eegLoading, eegError };
};