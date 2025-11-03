import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { xeroService } from "@/services/xeroService";
import { useXeroContext } from "@/context/xeroUtils";
import { toast } from "react-hot-toast";
import { RefreshCw } from "lucide-react";

const XeroCallbackRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const processedRef = useRef(false);
  const { checkConnectionStatus } = useXeroContext();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Prevent direct access
    if (!code && !state && !error) {
      console.log("Direct access to callback page detected, redirecting...");
      const returnUrl = localStorage.getItem("xero_return_url") || "/";
      localStorage.removeItem("xero_return_url");
      navigate(returnUrl, { replace: true });
      return;
    }

    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      if (error) {
        console.error("Xero auth error:", error);
        toast.error(`Xero authentication failed: ${error}`);
        setStatus("error");
        redirectWithDelay();
        return;
      }

      if (!code) {
        setStatus("error");
        toast.error("Authorization code missing from Xero response");
        redirectWithDelay();
        return;
      }

      try {
        setStatus("connecting");
        const result = await xeroService.handleCallback(code, state);

        if (result.success) {
          toast.success("Successfully connected to Xero!");
          setStatus("success");

          // Check connection status to update XeroContext
          try {
            console.log("Updating connection status in context...");
            await checkConnectionStatus();
          } catch (connectionError) {
            console.warn(
              "Failed to check connection status after callback:",
              connectionError
            );
          }
        } else {
          throw new Error(result.message || "Connection failed");
        }
      } catch (error) {
        console.error("Callback error:", error);
        toast.error(error.message || "Failed to connect to Xero");
        setStatus("error");
      } finally {
        redirectWithDelay();
      }
    };

    const redirectWithDelay = () => {
      const returnUrl = localStorage.getItem("xero_return_url") || "/";
      localStorage.removeItem("xero_return_url");

      setTimeout(() => {
        navigate(returnUrl, {
          replace: true,
          state: {
            xeroStatus: status === "success" ? "connected" : "failed",
            timestamp: Date.now(),
          },
        });
      }, 2000);
    };

    handleCallback();
  }, [searchParams, navigate, status, checkConnectionStatus]);

  const getStatusContent = () => {
    switch (status) {
      case "processing":
        return {
          title: "Processing...",
          description: "Validating your Xero authorization",
          color: "blue-600",
        };
      case "connecting":
        return {
          title: "Connecting to Xero...",
          description: "Setting up your Xero integration",
          color: "blue-600",
        };
      case "success":
        return {
          title: "Success!",
          description: "Connected to Xero successfully. Redirecting...",
          color: "green-600",
        };
      case "error":
        return {
          title: "Connection Failed",
          description: "There was an error connecting to Xero. Redirecting...",
          color: "red-600",
        };
      default:
        return {
          title: "Processing...",
          description: "Please wait...",
          color: "gray-600",
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <RefreshCw
          className={`h-12 w-12 mx-auto mb-4 text-${statusContent.color} ${
            status === "processing" || status === "connecting"
              ? "animate-spin"
              : ""
          }`}
        />
        <h2
          className={`mt-4 text-xl font-semibold text-${statusContent.color}`}
        >
          {statusContent.title}
        </h2>
        <p className="mt-2 text-gray-600">{statusContent.description}</p>
      </div>
    </div>
  );
};

export default XeroCallbackRedirect;
