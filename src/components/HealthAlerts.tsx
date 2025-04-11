import React, { useState } from 'react';
import { useAnomalies } from '../hooks/useAnomalies';
import { AlertTriangle, Check, X, ChevronDown, ChevronUp, Clock, RefreshCw, Phone, AlertOctagon, Activity } from 'lucide-react';
import { sendSOSMessage } from '../services/twilio';

const HealthAlerts = () => {
  const { anomalies, loading, refresh } = useAnomalies();
  const [expandedAlerts, setExpandedAlerts] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [showNormal, setShowNormal] = useState(true);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setLastRefreshTime(new Date());
    setIsRefreshing(false);
  };

  const toggleAlert = (id: string) => {
    if (expandedAlerts.includes(id)) {
      setExpandedAlerts(expandedAlerts.filter(alertId => alertId !== id));
    } else {
      setExpandedAlerts([...expandedAlerts, id]);
    }
  };

  const handleSOS = () => {
    setShowSOSModal(true);
  };

  const sendSOSAlert = async () => {
    try {
      const response = await sendSOSMessage(
        '+919906734598',
        'URGENT: Health Alert! Patient requires immediate attention. Current vitals indicate potential medical emergency. Location: Last known coordinates. Please respond immediately.'
      );

      if (response.success) {
        alert('SOS alert sent successfully');
      } else {
        alert('Failed to send SOS alert');
      }
    } catch (error) {
      console.error('Error sending SOS alert:', error);
      alert('Failed to send SOS alert');
    }
    setShowSOSModal(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      case 'normal':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatLastRefresh = (date: Date) => {
    return date.toLocaleString();
  };

  const filteredAnomalies = showNormal 
    ? anomalies 
    : anomalies.filter(a => a.severity !== 'normal');

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Health Alerts</h2>
          <p className="text-sm text-gray-400 flex items-center mt-1">
            <Clock className="h-4 w-4 mr-1" />
            Last updated: {formatLastRefresh(lastRefreshTime)}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            className={`px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2 flex-1 sm:flex-initial justify-center ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${showNormal ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'} flex items-center space-x-2 flex-1 sm:flex-initial justify-center`}
            onClick={() => setShowNormal(!showNormal)}
          >
            <Activity className="h-4 w-4" />
            <span>Normal Data</span>
          </button>
          <button 
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 flex items-center space-x-2 flex-1 sm:flex-initial justify-center"
            onClick={handleSOS}
          >
            <AlertOctagon className="h-4 w-4" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnomalies.map(anomaly => (
              <div 
                key={anomaly.id} 
                className={`bg-gray-800 rounded-lg overflow-hidden ${anomaly.status === 'resolved' ? 'opacity-70' : ''}`}
              >
                <div 
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer gap-4"
                  onClick={() => toggleAlert(anomaly.id)}
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className={`h-3 w-3 rounded-full ${getSeverityColor(anomaly.severity)}`}></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm sm:text-base">{anomaly.description}</h3>
                      <div className="text-xs sm:text-sm text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimestamp(anomaly.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs sm:text-sm px-2 py-1 rounded bg-gray-700">
                      {anomaly.type}
                    </span>
                    <span className={`text-xs sm:text-sm px-2 py-1 rounded ${
                      anomaly.severity === 'normal' ? 'bg-green-700' : 'bg-gray-700'
                    } capitalize`}>
                      {anomaly.status}
                    </span>
                    {expandedAlerts.includes(anomaly.id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
                
                {expandedAlerts.includes(anomaly.id) && (
                  <div className="p-4 border-t border-gray-700 bg-gray-900">
                    <p className="mb-4 text-sm sm:text-base">{anomaly.details}</p>
                    {anomaly.risks && anomaly.risks.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Assessment:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {anomaly.risks.map((risk, index) => (
                            <li key={index} className="text-xs sm:text-sm">
                              {risk.type} - {Math.round(risk.probability * 100)}% probability
                              <ul className="list-disc pl-5 mt-1">
                                {risk.indicators.map((indicator, i) => (
                                  <li key={i} className="text-xs sm:text-sm text-gray-400">{indicator}</li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex justify-end space-x-2">
                      {anomaly.status === 'active' && (
                        <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs sm:text-sm">
                          Mark as Resolved
                        </button>
                      )}
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs sm:text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-red-500 flex items-center">
              <AlertOctagon className="h-6 w-6 mr-2" />
              Emergency SOS
            </h3>
            <p className="mb-6 text-sm sm:text-base">
              This will immediately notify your emergency contacts and share your current health status and location with them.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Primary Contact</h4>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Contact: +91 9906734598
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold"
                  onClick={sendSOSAlert}
                >
                  Send SOS Alert
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                  onClick={() => setShowSOSModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthAlerts;