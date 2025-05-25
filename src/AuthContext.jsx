import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Inicializa desde sessionStorage
  const [apiKey, setApiKeyState] = useState(() => sessionStorage.getItem("apiKey"));

  const setApiKey = (key) => {
    if (key) {
      sessionStorage.setItem("apiKey", key);
    } else {
      sessionStorage.removeItem("apiKey");
    }
    setApiKeyState(key);
  };

  return (
    <AuthContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}