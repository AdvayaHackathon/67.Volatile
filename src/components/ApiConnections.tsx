import React from 'react';
import { useGoogleFitData } from '../hooks/useGoogleFitData';
import { RefreshCw, Check, X, Link, Database, Brain } from 'lucide-react';

const ApiConnections = () => {
  const { connected: googleFitConnected, connect: connectGoogleFit, disconnect: disconnectGoogleFit, lastSync, loading } = useGoogleFitData();
  const [showSettings, setShowSettings] = React.useState(false);

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">API Connections</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-red-400" />
              <h3 className="text-lg font-semibold">Google Fit</h3>
            </div>
            <div className={`px-2 py-1 rounded text-xs flex items-center ${googleFitConnected ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {googleFitConnected ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <X className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            Connect to Google Fit to import your ECG data for analysis and conversion.
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <span>Last synchronized:</span>
            <span>{formatLastSync(lastSync)}</span>
          </div>
          
          <div className="flex space-x-2">
            {googleFitConnected ? (
              <>
                <button 
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center space-x-1"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync Now</span>
                </button>
                <button 
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded"
                  onClick={disconnectGoogleFit}
                  disabled={loading}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button 
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center space-x-1"
                onClick={connectGoogleFit}
                disabled={loading}
              >
                <Link className="h-4 w-4" />
                <span>Connect</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold">OpenBCI</h3>
            </div>
            <div className="px-2 py-1 rounded text-xs flex items-center bg-red-900 text-red-300">
              <X className="h-3 w-3 mr-1" />
              Disconnected
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            Connect to OpenBCI to stream real-time EEG data for advanced brain activity analysis.
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <span>Last synchronized:</span>
            <span>Never</span>
          </div>
          
          <button 
            className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded flex items-center justify-center space-x-1"
          >
            <Link className="h-4 w-4" />
            <span>Connect OpenBCI</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiConnections;