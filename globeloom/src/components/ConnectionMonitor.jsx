// Connection Monitor Component for GlobeLoom
// Shows real-time connection status and allows manual reconnection

import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService_enhanced.js';

const ConnectionMonitor = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    // Update connection status
    const updateStatus = () => {
      setConnectionStatus(apiService.getConnectionStatus());
    };

    // Initial status
    updateStatus();

    // Listen for connection changes
    const handleEndpointChange = () => {
      updateStatus();
    };

    const handleOnlineStatus = () => {
      updateStatus();
    };

    window.addEventListener('backendEndpointChanged', handleEndpointChange);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Update status every 5 seconds
    const interval = setInterval(updateStatus, 5000);

    return () => {
      window.removeEventListener('backendEndpointChanged', handleEndpointChange);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  const handleReconnect = async () => {
    setIsReconnecting(true);
    try {
      await apiService.discoverEndpoint();
      setConnectionStatus(apiService.getConnectionStatus());
    } catch (error) {
      console.error('Reconnection failed:', error);
    } finally {
      setIsReconnecting(false);
    }
  };

  if (!connectionStatus) {
    return null;
  }

  const getStatusColor = () => {
    if (!connectionStatus.isOnline) return 'bg-gray-500';
    if (connectionStatus.connected) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (!connectionStatus.isOnline) return 'Offline';
    if (connectionStatus.connected) return 'Connected';
    return 'Disconnected';
  };

  const getStatusIcon = () => {
    if (!connectionStatus.isOnline) return '📴';
    if (connectionStatus.connected) return '🟢';
    return '🔴';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Status Indicator */}
      <div 
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg cursor-pointer
          transition-all duration-300 hover:shadow-xl
          ${connectionStatus.connected ? 'bg-white border border-gray-200' : 'bg-white border-2 border-red-200'}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <span className="text-sm font-medium text-gray-700">
          {getStatusIcon()} {getStatusText()}
        </span>
        {connectionStatus.queuedRequests > 0 && (
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
            {connectionStatus.queuedRequests} queued
          </span>
        )}
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-80">
          <h3 className="font-semibold text-gray-800 mb-3">Connection Details</h3>
          
          {/* Current Status */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`text-sm font-medium ${
                connectionStatus.connected ? 'text-green-600' : 'text-red-600'
              }`}>
                {getStatusText()}
              </span>
            </div>
            
            {connectionStatus.endpoint && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Endpoint:</span>
                <span className="text-sm font-mono text-blue-600 truncate max-w-48">
                  {connectionStatus.endpoint}
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Network:</span>
              <span className={`text-sm font-medium ${
                connectionStatus.isOnline ? 'text-green-600' : 'text-red-600'
              }`}>
                {connectionStatus.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {connectionStatus.queuedRequests > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Queued Requests:</span>
                <span className="text-sm font-medium text-orange-600">
                  {connectionStatus.queuedRequests}
                </span>
              </div>
            )}

            {connectionStatus.lastChecked && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Checked:</span>
                <span className="text-sm text-gray-500">
                  {new Date(connectionStatus.lastChecked).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>

          {/* Available Endpoints */}
          {connectionStatus.knownEndpoints && connectionStatus.knownEndpoints.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Known Endpoints:</h4>
              <div className="space-y-1">
                {connectionStatus.knownEndpoints.map((endpoint, index) => (
                  <div 
                    key={index}
                    className={`text-xs p-2 rounded font-mono ${
                      endpoint === connectionStatus.endpoint 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    {endpoint === connectionStatus.endpoint && '✓ '}{endpoint}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleReconnect}
              disabled={isReconnecting}
              className={`
                flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                ${isReconnecting 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {isReconnecting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reconnecting...
                </span>
              ) : (
                '🔄 Reconnect'
              )}
            </button>
            
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionMonitor;
