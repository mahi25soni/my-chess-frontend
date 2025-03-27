"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ Add loading state
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser)); // ✅ Parse user JSON
      }
      setIsLoading(false); // ✅ Done loading
    }
  }, []);

  const login = (tokenProvided, userProvided) => {
    localStorage.setItem("token", tokenProvided);
    localStorage.setItem("user", JSON.stringify(userProvided)); // ✅ Stringify user JSON
    setToken(tokenProvided);
    setUser(JSON.parse(userProvided));
    router.push("/"); // ✅ Redirect after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.push("/login"); // ✅ Redirect after logout
  };

  return (
    <AuthContext.Provider value={{ user, token, logout, isLoading, login }}>
      {!isLoading && children} {/* ✅ Only render children when loaded */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
