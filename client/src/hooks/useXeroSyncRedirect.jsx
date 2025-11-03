import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { xeroService } from "@/services/xeroService";

export const useXeroSyncRedirect = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [error, setError] = useState(null);

  // Check connection status function
  const checkConnectionStatus = useCallback(async () => {
    try {
      const result = await xeroService.getConnectionStatus();
      console.log("Connection status result:", result);
      if (result.success && result.data) {
        setIsSynced(result.data.isConnected || false);
        setLastSyncTime(Date.now());
      } else {
        setIsSynced(false);
      }
    } catch (error) {
      console.error("Error checking connection status:", error);
      setIsSynced(false);
    }
  }, []);

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
        setTimeout(checkConnectionStatus, 1000);
      }

      return result;
    } catch (error) {
      const errorMessage = error.message || "Failed to sync with Xero";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error in useXero hook:", error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    sync,
    isSyncing,
    isSynced,
    lastSyncTime,
    error,
    checkConnectionStatus,
  };
};
