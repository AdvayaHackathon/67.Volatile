import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Shield, AlertTriangle, Activity, UserCircle, MessageSquareHeart, LogOut, Coins, FileInput } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Dashboard = ({ session }) => {
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleConnect = () => {
    setIsConnected(true);
  };

  const openNeuroCareBot = () => {
    // Instead of opening in a new tab, navigate to the URL in the same tab
    window.location.href = 'https://neurocarebot.onrender.com/';
  };

  const openTokenPage = () => {
    window.open('https://v0-solidity-frontend-integration.vercel.app/token', '_blank');
  };

  const openStackBlitz = () => {
    // Instead of opening in a new tab, navigate to the URL in the same tab
    window.location.href = 'https://prescriptionsummariser.onrender.com';
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
            <Link
              to="/"
              className={`p-3 rounded-lg ${location.pathname === '/' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              title="Patient Dashboard"
            >
              <UserCircle className="h-5 w-5 md:h-6 md:w-6" />
            </Link>
            <Link
              to="/twin"
              className={`p-3 rounded-lg ${location.pathname === '/twin' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              title="Digital Twin"
            >
              <Activity className="h-5 w-5 md:h-6 md:w-6" />
            </Link>
            <Link
              to="/alerts"
              className={`p-3 rounded-lg ${location.pathname === '/alerts' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              title="Health Alerts"
            >
              <AlertTriangle className="h-5 w-5 md:h-6 md:w-6" />
            </Link>
            <Link
              to="/recommendations"
              className={`p-3 rounded-lg ${location.pathname === '/recommendations' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              title="Recommendations"
            >
              <Shield className="h-5 w-5 md:h-6 md:w-6" />
            </Link>
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
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;