import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Brain, Shield, AlertTriangle, Activity, UserCircle, 
  MessageSquareHeart, LogOut, Coins, FileInput, 
  Menu, X, Bell, Settings, ChevronDown, Search, Moon, Sun
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Dashboard = ({ session }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Appointment reminder: Dr. Smith tomorrow at 10 AM", read: false },
    { id: 2, text: "New health recommendation available", read: false },
    { id: 3, text: "Your latest blood test results are ready", read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleConnect = () => {
    setIsConnected(true);
  };

  const openNeuroCareBot = () => {
    // Store the current app URL before navigating away
    localStorage.setItem('returnToApp', window.location.href);
    window.location.href = 'https://neurocarebot.onrender.com/';
  };

  const openTokenPage = () => {
    window.open('https://v0-solidity-frontend-integration.vercel.app/token', '_blank');
  };

  const openStackBlitz = () => {
    // Store the current app URL before navigating away
    localStorage.setItem('returnToApp', window.location.href);
    window.location.href = 'https://prescriptionsummariser.onrender.com';
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Get user initials for avatar
  const userEmail = session?.user?.email || '';
  const userInitials = userEmail.split('@')[0].substring(0, 2).toUpperCase();

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`p-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm z-20`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} md:hidden`}
            >
              {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <img src="https://i.imgur.com/OpEOQQp.png" alt="NeuroPulse Logo" className="h-8 w-8 md:h-10 md:w-10" />
              <h1 className="text-xl font-bold md:text-2xl hidden md:block">NeuroPulse</h1>
            </Link>
          </div>
          
          {/* <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className={`flex items-center w-full rounded-lg px-3 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Search className="h-4 w-4 mr-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search health records, medications..."
                className={`bg-transparent focus:outline-none w-full ${darkMode ? 'placeholder:text-gray-400' : 'placeholder:text-gray-500'}`}
              />
            </div>
          </div> */}

          <div className="flex items-center space-x-3">
            {/* <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button> */}

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} relative`}
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg overflow-hidden z-30 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <div className="flex items-center justify-between p-3 border-b border-gray-700">
                    <h3 className="font-medium">Notifications</h3>
                    <button 
                      onClick={markAllNotificationsAsRead}
                      className="text-sm text-blue-400 hover:text-blue-500"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${notification.read ? '' : darkMode ? 'bg-gray-700/50' : 'bg-blue-50'}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <p className="text-sm">{notification.text}</p>
                          <span className="text-xs text-gray-400 mt-1">1 hour ago</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!isConnected && (
              <button
                onClick={handleConnect}
                className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2 text-white`}
              >
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Connect Google Fit</span>
              </button>
            )}
            
            {isConnected && (
              <button
                onClick={openTokenPage}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg flex items-center space-x-2 text-white"
              >
                <Coins className="h-4 w-4" />
                <span className="hidden sm:inline">Token</span>
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-1 p-1 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium">
                  {userInitials}
                </div>
                <ChevronDown className="h-4 w-4 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg overflow-hidden z-30 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="font-medium">{session?.user?.email}</p>
                    <p className="text-sm text-gray-400">Patient</p>
                  </div>
                  <div className="p-2">
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} flex items-center space-x-2`}
                    >
                      {/* <Settings className="h-4 w-4" /> */}
                      {/* <span>Settings</span> */}
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className={`w-full text-left px-3 py-2 rounded-md ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'} flex items-center space-x-2`}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex">
        {/* Sidebar */}
        <nav 
          className={`${sidebarCollapsed ? 'hidden' : 'block'} md:block
            ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
            border-r z-10 transition-all duration-300 ease-in-out
            ${sidebarCollapsed ? 'w-16' : 'w-64'} md:w-64`}
        >
          <div className="h-full flex flex-col p-4">
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-4 px-2">Main Navigation</h2>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === '/' 
                          ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`
                          : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                      }`}
                    >
                      <UserCircle className="h-5 w-5" />
                      <span className="font-medium">Patient Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/twin"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === '/twin' 
                          ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`
                          : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                      }`}
                    >
                      <Activity className="h-5 w-5" />
                      <span className="font-medium">Digital Twin</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/alerts"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === '/alerts' 
                          ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`
                          : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                      }`}
                    >
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium">Health Alerts</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/recommendations"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === '/recommendations' 
                          ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`
                          : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Recommendations</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-4 px-2">External Tools</h2>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={openNeuroCareBot}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <MessageSquareHeart className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">NeuroCareBot</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={openStackBlitz}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <FileInput className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Document Scanner</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className={`mt-auto pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
    Your next appointment:
  </p>
  <p className="font-medium">Dr. Johnson</p>
  <p className="text-sm text-blue-500">
  {new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
</p>
</div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className={`flex-1 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;