"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13+

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (window) {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token) {
        setToken(token);
        setUser(user);
      } else {
        router.push("/login");
      }
    }
  }, []);

  const setUpUserAndToken = (tokenProvided, userProvided) => {
    localStorage.setItem("token", tokenProvided);
    localStorage.setItem("user", userProvided);
    setToken(tokenProvided);
    setUser(userProvided);
    router.push("/");
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, logout, setUpUserAndToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
