import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { xeroService } from "@/services/xeroService";
import propTypes from "prop-types";
import { XeroContext } from "./xeroUtils";

export const XeroProvider = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [error, setError] = useState(null);
  const [connectionData, setConnectionData] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const intervalRef = useRef(null);

  // Check connection status function
  const checkConnectionStatus = useCallback(async () => {
    try {
      const result = await xeroService.getConnectionStatus();
      console.log("Connection status result:", result);

      if (result.success && result.data) {
        setIsSynced(result.data.isConnected || false);
        setLastSyncTime(Date.now());
        setConnectionData(result.data);
        setError(null);
        return result;
      } else {
        setIsSynced(false);
        setConnectionData(null);
        return result;
      }
    } catch (error) {
      console.error("Error checking connection status:", error);
      setIsSynced(false);
      setConnectionData(null);
      setError("Failed to check connection status");
      return null;
    }
  }, []);

  // Initialize connection check on mount and after auth callback
  useEffect(() => {
    const initializeConnection = async () => {
      setIsInitializing(true);

      // Check if we're returning from Xero auth callback
      const urlParams = new URLSearchParams(window.location.search);
      const hasAuthCode = urlParams.has("code") || urlParams.has("state");

      if (hasAuthCode) {
        // Give some time for callback processing
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      await checkConnectionStatus();
      setIsInitializing(false);
    };

    initializeConnection();
  }, [checkConnectionStatus]);

  // Auto-refresh connection status when URL changes (for callback scenarios)
  useEffect(() => {
    const handleURLChange = () => {
      // Check if we have auth parameters and refresh connection
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("code") || urlParams.has("state")) {
        setTimeout(() => {
          checkConnectionStatus();
        }, 2000); // Wait for callback processing
      }
    };

    // Listen for URL changes
    window.addEventListener("popstate", handleURLChange);

    return () => {
      window.removeEventListener("popstate", handleURLChange);
    };
  }, [checkConnectionStatus]);

  // Smart interval setup with proper ISO format handling
  const setupSmartInterval = useCallback(async () => {
    try {
      const result = await checkConnectionStatus();

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (result?.success && result?.data?.expiresAt) {
        const expiryTime = new Date(result.data.expiresAt);

        // Validate the parsed date
        if (isNaN(expiryTime.getTime())) {
          throw new Error("Invalid expiresAt ISO format");
        }

        // Define time constants
        const oneMinuteInMs = 60 * 1000;
        const fiveMinutesInMs = 5 * 60 * 1000;
        const tenMinutesInMs = 10 * 60 * 1000;

        const now = new Date();
        const timeUntilExpiry = expiryTime.getTime() - now.getTime();

        console.log(`Token expires at: ${expiryTime.toISOString()}`);
        console.log(`Current time: ${now.toISOString()}`);
        console.log(
          `Time until expiry: ${Math.round(timeUntilExpiry / 1000)} seconds`
        );

        if (timeUntilExpiry > 0) {
          // Check 5 minutes before expiry, or every 10 minutes if expiry is far away
          const checkInterval = Math.min(
            timeUntilExpiry - fiveMinutesInMs, // 5 minutes before expiry
            tenMinutesInMs // Maximum 10 minutes
          );
          const safeInterval = Math.max(checkInterval, oneMinuteInMs); // Minimum 1 minute

          console.log(
            `Setting up smart check in ${Math.round(
              safeInterval / 1000
            )} seconds`
          );
          intervalRef.current = setInterval(setupSmartInterval, safeInterval);
        } else {
          // Already expired, check every minute
          console.log("Token already expired, checking every minute");
          intervalRef.current = setInterval(
            checkConnectionStatus,
            oneMinuteInMs
          );
        }
      } else {
        console.log("No expiry data, using fallback interval (5 minutes)");
        intervalRef.current = setInterval(checkConnectionStatus, 5 * 60 * 1000);
      }
    } catch (error) {
      console.error("Error setting up smart interval:", error);
      intervalRef.current = setInterval(checkConnectionStatus, 5 * 60 * 1000);
    }
  }, [checkConnectionStatus]);

  // Helper function to format time remaining for display
  const getTimeRemaining = useCallback(() => {
    if (!connectionData?.expiresAt) return null;

    try {
      const expiryTime = new Date(connectionData.expiresAt);
      const now = new Date();
      const timeUntilExpiry = expiryTime.getTime() - now.getTime();

      if (timeUntilExpiry <= 0) {
        return "Expired";
      }

      const minutes = Math.floor(timeUntilExpiry / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} remaining`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} remaining`;
      } else {
        return `${minutes} minute${minutes > 1 ? "s" : ""} remaining`;
      }
    } catch (error) {
      console.error("Error calculating time remaining:", error);
      return "Unknown";
    }
  }, [connectionData?.expiresAt]);

  const handleXeroAuth = (authUrl) => {
    localStorage.setItem("xero_return_url", window.location.pathname);
    window.location.href = authUrl;
  };

  const sync = async () => {
    setIsSyncing(true);
    setError(null);

    try {
      const result = await xeroService.sync();

      if (!result.success && result.requiresAuth && result.authUrl) {
        handleXeroAuth(result.authUrl);
        return result;
      }

      if (result.success) {
        setIsSynced(true);
        setLastSyncTime(new Date());
        toast.success(result.message || "Successfully synced with Xero");
        setTimeout(() => {
          setupSmartInterval(); // Reset smart interval after sync
        }, 1000);
      } else {
        setError(result.message || "Sync failed");
        toast.error(result.message || "Sync failed");
      }

      return result;
    } catch (error) {
      const errorMessage = error.message || "Failed to sync with Xero";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error in Xero sync:", error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // Force refresh connection status (for manual refresh scenarios)
  const forceRefresh = useCallback(async () => {
    setIsInitializing(true);
    await checkConnectionStatus();
    setIsInitializing(false);
  }, [checkConnectionStatus]);

  // Initialize smart checking when provider mounts
  useEffect(() => {
    if (!isInitializing) {
      setupSmartInterval();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [setupSmartInterval, isInitializing]);

  const value = {
    sync,
    isSyncing,
    isSynced,
    lastSyncTime,
    error,
    connectionData,
    checkConnectionStatus,
    getTimeRemaining,
    forceRefresh,
    isInitializing,
  };

  return <XeroContext.Provider value={value}>{children}</XeroContext.Provider>;
};

XeroProvider.propTypes = {
  children: propTypes.node.isRequired,
};
