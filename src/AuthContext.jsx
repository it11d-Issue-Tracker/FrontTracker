import { createContext, useContext, useState } from "react";
import { users } from "./data/users"; // Asegúrate de que la ruta sea correcta

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [apiKey, setApiKeyState] = useState(() => sessionStorage.getItem("apiKey"));
  const [userId, setUserIdState] = useState(() => {
    const storedKey = sessionStorage.getItem("apiKey");
    const user = users.find((u) => u.apiKey === storedKey);
    return user?.id || null;
  });

  const setApiKey = (key) => {
    if (key) {
      sessionStorage.setItem("apiKey", key);
      const user = users.find((u) => u.apiKey === key);
      setUserIdState(user?.id || null);
    } else {
      sessionStorage.removeItem("apiKey");
      setUserIdState(null);
    }
    setApiKeyState(key);
  };

  return (
    <AuthContext.Provider value={{ apiKey, setApiKey, id: userId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
