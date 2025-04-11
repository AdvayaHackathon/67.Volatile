import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import HeartModel from './models/HeartModel';
import BrainModel from './models/BrainModel';
import { Brain, Heart, Activity } from 'lucide-react';

const Visualization3D = () => {
  const [activeModel, setActiveModel] = useState<'heart' | 'brain'>('heart');
  const [heartState, setHeartState] = useState('normal');
  const [brainState, setBrainState] = useState('normal');

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">3D Visualization</h2>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeModel === 'heart' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setActiveModel('heart')}
          >
            <Heart className="h-4 w-4" />
            <span>Heart Model</span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeModel === 'brain' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setActiveModel('brain')}
          >
            <Brain className="h-4 w-4" />
            <span>Brain Model</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
        {activeModel === 'heart' ? (
          <div className="h-full relative">
            <div className="absolute top-4 left-4 z-10 space-y-2">
              <button
                className={`px-4 py-2 rounded-lg w-full ${
                  heartState === 'normal' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setHeartState('normal')}
              >
                Normal (75 BPM)
              </button>
              <button
                className={`px-4 py-2 rounded-lg w-full ${
                  heartState === 'gym' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setHeartState('gym')}
              >
                Exercise (150 BPM)
              </button>
              <button
                className={`px-4 py-2 rounded-lg w-full ${
                  heartState === 'sleeping' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setHeartState('sleeping')}
              >
                Sleep (55 BPM)
              </button>
            </div>
            <HeartModel heartRate={75} state={heartState} />
          </div>
        ) : (
          <div className="h-full relative">
            <div className="absolute top-4 left-4 z-10 space-y-2">
              <button
                className={`px-4 py-2 rounded-lg w-full ${
                  brainState === 'normal' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setBrainState('normal')}
              >
                Normal Activity
              </button>
              <button
                className={`px-4 py-2 rounded-lg w-full ${
                  brainState === 'tension' ? 'bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setBrainState('tension')}
              >
                Mental Tension
              </button>
              <button
                className={`px-4 py-2 rounded-lg w-full ${
                  brainState === 'migraine' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setBrainState('migraine')}
              >
                Migraine Pattern
              </button>
            </div>
            <BrainModel activeRegions={brainState === 'normal' ? [] : ['frontal', 'temporal']} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualization3D;