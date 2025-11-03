import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.errors[0]?.message || data.message || "Login failed");
    }
    console.log("Login successful:", data);
    authService.setToken(data.data.token);

    return data;
  },

  getToken: () => Cookies.get("token"),

  setToken: (token) => {
    Cookies.set("token", token, {
      expires: 1,
      secure: true,
      sameSite: "Strict",
    });
  },

  removeToken: () => Cookies.remove("token"),

  isAuthenticated: () => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);

      if (
        !decoded.userId ||
        !decoded.iat ||
        !decoded.jti ||
        decoded.exp * 1000 < Date.now()
      ) {
        authService.removeToken();
        return false;
      }
      return true;
    } catch {
      authService.removeToken();
      return false;
    }
  },

  getUserInfo: () => {
    try {
      const token = authService.getToken();
      if (!token) return null;

      const decoded = jwtDecode(token);
      return {
        userId: decoded.userId,
        userName: decoded.userName,
        email: decoded.email,
      };
    } catch {
      return null;
    }
  },

  logout: () => {
    authService.removeToken();
    localStorage.clear();
  },
};
