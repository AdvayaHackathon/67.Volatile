import React, { useState } from 'react';
import DigitalTwin from './DigitalTwin';
import HealthAlerts from './HealthAlerts';
import Recommendations from './Recommendations';
import PatientDashboard from './PatientDashboard';
import { Brain, Shield, AlertTriangle, Activity, UserCircle, MessageSquareHeart, LogOut, Coins, FileInput } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Dashboard = ({ session }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleConnect = () => {
    setIsConnected(true);
  };

  const openNeuroCareBot = () => {
    window.open('https://neurocarebot.onrender.com/', '_blank');
  };

  const openTokenPage = () => {
    window.open('https://v0-solidity-frontend-integration.vercel.app/token', '_blank');
  };

  const openStackBlitz = () => {
    window.open('https://prescriptionsummariser.onrender.com', '_blank');
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="https://i.imgur.com/OpEOQQp.png" alt="NeuroPulse Logo" className="h-8 w-8 md:h-10 md:w-10" />
            <h1 className="text-xl font-bold md:text-2xl">NeuroPulse</h1>
          </div>
          <div className="flex items-center space-x-4">
            {!isConnected && (
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2"
              >
                <Activity className="h-4 w-4" />
                <span>Connect to Google Fit API</span>
              </button>
            )}
            {isConnected && (
              <button
                onClick={openTokenPage}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg flex items-center space-x-2"
              >
                <Coins className="h-4 w-4" />
                <span>Token</span>
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="p-2 rounded-full hover:bg-gray-700 flex items-center space-x-2"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex">
        <nav className="w-16 bg-gray-800 border-r border-gray-700 md:w-20">
          <div className="flex flex-col items-center py-4 space-y-6">
            <button
              className={`p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('dashboard')}
              title="Patient Dashboard"
            >
              <UserCircle className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              className={`p-3 rounded-lg ${activeTab === 'twin' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('twin')}
              title="Digital Twin"
            >
              <Activity className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              className={`p-3 rounded-lg ${activeTab === 'alerts' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('alerts')}
              title="Health Alerts"
            >
              <AlertTriangle className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              className={`p-3 rounded-lg ${activeTab === 'recommendations' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('recommendations')}
              title="Recommendations"
            >
              <Shield className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              className="p-3 rounded-lg hover:bg-gray-700"
              onClick={openNeuroCareBot}
              title="NeuroCareBot"
            >
              <MessageSquareHeart className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              className="p-3 rounded-lg hover:bg-gray-700"
              onClick={openStackBlitz}
              title="Open StackBlitz"
            >
              <FileInput className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </nav>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {activeTab === 'dashboard' && <PatientDashboard session={session} />}
          {activeTab === 'twin' && <DigitalTwin isConnected={isConnected} />}
          {activeTab === 'alerts' && <HealthAlerts />}
          {activeTab === 'recommendations' && <Recommendations />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;