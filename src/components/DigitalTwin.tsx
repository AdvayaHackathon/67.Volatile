import React, { useState, useEffect } from 'react';
import { useECGData } from '../hooks/useECGData';
import { useEEGData } from '../hooks/useEEGData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, Heart, Dumbbell, Moon, Zap, Waves } from 'lucide-react';
import HeartModel from './models/HeartModel';
import BrainModel from './models/BrainModel';

const DigitalTwin = ({ isConnected }) => {
  const { ecgData, ecgLoading } = useECGData();
  const { eegData, eegLoading } = useEEGData();
  const [heartState, setHeartState] = useState('normal');
  const [brainState, setBrainState] = useState('normal');

  // Heart rates for different states
  const heartRates = {
    normal: 75,
    gym: 150,
    sleeping: 55,
    anxiety: 120
  };

  // Brain stress regions for different states
  const brainStressRegions = {
    normal: [],
    tension: ['frontal', 'temporal'],
    migraine: ['occipital', 'temporal'],
    anxiety: ['frontal', 'parietal']
  };

  // Mock data for initial display
  const [mockData, setMockData] = useState<any[]>([]);

  // Generate data based on current state
  const generateStateData = (time: number, state: string) => {
    let ecgValue, eegValue;

    switch (state) {
      case 'gym':
        ecgValue = Math.sin(time * 3) * 0.8 + Math.sin(time * 4) * 0.4 + Math.random() * 0.1;
        eegValue = Math.sin(time * 2) * 0.5 + Math.cos(time * 3) * 0.3 + Math.random() * 0.05;
        break;
      case 'sleeping':
        ecgValue = Math.sin(time * 0.8) * 0.3 + Math.sin(time * 1.2) * 0.2 + Math.random() * 0.05;
        eegValue = Math.sin(time * 0.3) * 0.6 + Math.cos(time * 0.5) * 0.4 + Math.random() * 0.03;
        break;
      case 'anxiety':
        ecgValue = Math.sin(time * 2) * 0.6 + Math.sin(time * 5) * 0.4 + Math.random() * 0.2;
        eegValue = Math.sin(time * 1.5) * 0.7 + Math.cos(time * 4) * 0.3 + Math.random() * 0.1;
        break;
      default:
        ecgValue = Math.sin(time) * 0.5 + Math.sin(time * 2) * 0.3 + Math.random() * 0.1;
        eegValue = Math.sin(time * 0.5) * 0.3 + Math.cos(time * 1.5) * 0.2 + Math.random() * 0.05;
    }

    return { ecgValue, eegValue };
  };

  useEffect(() => {
    const generateMockData = () => {
      const data = [];
      for (let i = 0; i < 100; i++) {
        const time = i * 0.1;
        const { ecgValue, eegValue } = generateStateData(time, heartState);
        
        data.push({
          time: time.toFixed(1),
          ecg: ecgValue,
          eeg: eegValue
        });
      }
      return data;
    };

    setMockData(generateMockData());

    const interval = setInterval(() => {
      setMockData(prev => {
        const newData = [...prev.slice(1)];
        const lastTime = parseFloat(prev[prev.length - 1].time);
        const newTime = lastTime + 0.1;
        const { ecgValue, eegValue } = generateStateData(newTime, heartState);
        
        newData.push({
          time: newTime.toFixed(1),
          ecg: ecgValue,
          eeg: eegValue
        });
        
        return newData;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [heartState]);

  useEffect(() => {
    switch (heartState) {
      case 'gym':
        setBrainState('tension');
        break;
      case 'sleeping':
        setBrainState('normal');
        break;
      case 'anxiety':
        setBrainState('anxiety');
        break;
      default:
        setBrainState('normal');
    }
  }, [heartState]);

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Heart className="h-5 w-5 text-red-400 mr-2" />
              ECG Signal
            </h3>
            {isConnected && (
              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded ${heartState === 'gym' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => setHeartState('gym')}
                  title="While doing gym"
                >
                  <Dumbbell className="h-4 w-4" />
                </button>
                <button
                  className={`p-2 rounded ${heartState === 'sleeping' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => setHeartState('sleeping')}
                  title="Sleeping"
                >
                  <Moon className="h-4 w-4" />
                </button>
                <button
                  className={`p-2 rounded ${heartState === 'anxiety' ? 'bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => setHeartState('anxiety')}
                  title="Anxiety"
                >
                  <Zap className="h-4 w-4" />
                </button>
                <button
                  className={`p-2 rounded ${heartState === 'normal' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => setHeartState('normal')}
                  title="Normal"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ecg" 
                  stroke="#ff4560" 
                  dot={false} 
                  strokeWidth={2}
                  animationDuration={100}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Brain className="h-5 w-5 text-blue-400 mr-2" />
              EEG Signal
            </h3>
            {isConnected && (
              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded ${brainState === 'tension' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => setBrainState('tension')}
                  title="Mental Tension"
                >
                  <Waves className="h-4 w-4" />
                </button>
                <button
                  className={`p-2 rounded ${brainState === 'normal' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => setBrainState('normal')}
                  title="Normal"
                >
                  <Brain className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="eeg" 
                  stroke="#00e396" 
                  dot={false} 
                  strokeWidth={2}
                  animationDuration={100}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold flex items-center">
              <Heart className="h-5 w-5 text-red-400 mr-2" />
              Heart Visualization
              {isConnected && (
                <span className="ml-2 text-sm bg-blue-900 text-blue-300 px-2 py-1 rounded">
                  HR: {heartRates[heartState]} BPM
                </span>
              )}
            </h3>
          </div>
          <div className="bg-gray-900 rounded-lg flex-1 overflow-hidden relative">
            <HeartModel heartRate={heartRates[heartState]} state={heartState} />
            
            <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 p-2 rounded text-xs">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>Left Ventricle</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-red-700 rounded-full mr-1"></div>
                <span>Right Ventricle</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span>Left Atrium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-700 rounded-full mr-1"></div>
                <span>Right Atrium</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold flex items-center">
              <Brain className="h-5 w-5 text-blue-400 mr-2" />
              Brain Visualization
            </h3>
          </div>
          <div className="bg-gray-900 rounded-lg flex-1 overflow-hidden relative">
            <BrainModel activeRegions={brainStressRegions[brainState]} />
            
            <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 p-2 rounded text-xs">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                <span>Frontal Lobe (Focus, Emotion)</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span>Parietal Lobe (Sensory)</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>Temporal Lobe (Memory)</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                <span>Occipital Lobe (Vision)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>Cerebellum (Balance)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;