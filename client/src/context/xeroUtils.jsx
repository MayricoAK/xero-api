import { createContext, useContext } from "react";

export const XeroContext = createContext();

export const useXeroContext = () => {
  const context = useContext(XeroContext);
  if (!context) {
    throw new Error("useXeroContext must be used within XeroProvider");
  }
  return context;
};
