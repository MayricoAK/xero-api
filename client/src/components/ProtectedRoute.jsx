import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { authService } from "@/services/authService";

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!authService.isAuthenticated()) {
        authService.logout();
        toast.error("Session expired or unauthorized access");
        window.location.href = "/login";
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
