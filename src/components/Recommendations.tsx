import React, { useState } from 'react';
import { Brain, Heart, Activity, ChevronDown, ChevronUp, Clock, RefreshCw } from 'lucide-react';
import { useRecommendations } from '../hooks/useRecommendations';

const Recommendations = () => {
  const { recommendations, loading, refresh } = useRecommendations();
  const [expandedRecommendations, setExpandedRecommendations] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const toggleRecommendation = (id: string) => {
    if (expandedRecommendations.includes(id)) {
      setExpandedRecommendations(expandedRecommendations.filter(recId => recId !== id));
    } else {
      setExpandedRecommendations([...expandedRecommendations, id]);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cardiac':
        return <Heart className="h-5 w-5 text-red-400" />;
      case 'Neurological':
        return <Brain className="h-5 w-5 text-blue-400" />;
      case 'Combined':
        return <Activity className="h-5 w-5 text-purple-400" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Health Recommendations</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-400" />
            <span>Cardiac</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2">
            <Brain className="h-4 w-4 text-blue-400" />
            <span>Neurological</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2">
            <Activity className="h-4 w-4 text-purple-400" />
            <span>Combined</span>
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
            {recommendations.map(recommendation => (
              <div 
                key={recommendation.id} 
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <div 
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer gap-4"
                  onClick={() => toggleRecommendation(recommendation.id)}
                >
                  <div className="flex items-center space-x-4">
                    {getCategoryIcon(recommendation.category)}
                    <div>
                      <h3 className="font-semibold">{recommendation.title}</h3>
                      <div className="text-sm text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimestamp(recommendation.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm px-2 py-1 rounded bg-gray-700">
                      {recommendation.category}
                    </span>
                    <span className={`text-sm ${getConfidenceColor(recommendation.confidence)}`}>
                      {Math.round(recommendation.confidence * 100)}% confidence
                    </span>
                    {expandedRecommendations.includes(recommendation.id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
                
                {expandedRecommendations.includes(recommendation.id) && (
                  <div className="p-4 border-t border-gray-700 bg-gray-900">
                    <p className="mb-4">{recommendation.description}</p>
                    
                    <h4 className="font-semibold mb-2">Recommendations:</h4>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      {recommendation.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                    
                    <div className="text-sm text-gray-400">
                      Source: {recommendation.source}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;