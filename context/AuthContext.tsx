"use client";
import { createContext, useState, useEffect } from "react";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface User {
  [x: string]: any;
  id: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const logout = () => {
    setUser(null);
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/");
  };

  // Proactive token check on mount
  useEffect(() => {
    const token = Cookies.get("token");
    const userData = Cookies.get("user");
    if (token && userData) {
      api
        .get("/incidents", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setUser(JSON.parse(userData));
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.status === 401 &&
            typeof error.response.data?.error === "string" &&
            error.response.data.error.includes("token is expired")
          ) {
            logout();
            alert("Session expired. Please log in again.");
          } else {
            setUser(JSON.parse(userData));
          }
        });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const token = Cookies.get("token");
      const userData = Cookies.get("user");
      if (token && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    setUser(response.data.user.user);
    Cookies.set("token", response.data.user.token, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("user", JSON.stringify(response.data.user.user), {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
