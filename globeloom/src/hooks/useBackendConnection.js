// React Hook for Backend Connectivity and Service Discovery
import { useState, useEffect, useCallback } from "react";
import apiService from "../services/apiService_enhanced.js";

export const useBackendConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastError, setLastError] = useState(null);

  // Update connection status
  const updateStatus = useCallback(() => {
    setConnectionStatus(apiService.getConnectionStatus());
  }, []);

  // Manually trigger reconnection
  const reconnect = useCallback(async () => {
    setIsConnecting(true);
    setLastError(null);

    try {
      await apiService.discoverEndpoint();
      updateStatus();
    } catch (error) {
      setLastError(error.message);
      console.error("Reconnection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  }, [updateStatus]);

  // Test connection with a simple health check
  const testConnection = useCallback(async () => {
    try {
      await apiService.get("/health");
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  useEffect(() => {
    // Initial status
    updateStatus();

    // Listen for connection changes
    const handleEndpointChange = () => {
      updateStatus();
      setLastError(null);
    };

    const handleOnlineStatus = () => {
      updateStatus();
    };

    window.addEventListener("backendEndpointChanged", handleEndpointChange);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // Update status periodically
    const interval = setInterval(updateStatus, 10000);

    return () => {
      window.removeEventListener(
        "backendEndpointChanged",
        handleEndpointChange
      );
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
      clearInterval(interval);
    };
  }, [updateStatus]);

  return {
    connectionStatus,
    isConnecting,
    lastError,
    reconnect,
    testConnection,
    updateStatus,
  };
};

// Hook for making API calls with automatic retry and error handling
export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const makeCall = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    makeCall,
    reset,
  };
};

// Hook for queue management
export const useRequestQueue = () => {
  const [queueStatus, setQueueStatus] = useState({
    queuedRequests: 0,
    isProcessingQueue: false,
  });

  useEffect(() => {
    const updateQueueStatus = () => {
      const status = apiService.getConnectionStatus();
      setQueueStatus({
        queuedRequests: status.queuedRequests,
        isProcessingQueue: status.isProcessingQueue,
      });
    };

    // Update initially
    updateQueueStatus();

    // Update when requests are queued or processed
    const interval = setInterval(updateQueueStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  return queueStatus;
};

export default { useBackendConnection, useApiCall, useRequestQueue };
