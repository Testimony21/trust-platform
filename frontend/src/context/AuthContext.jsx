import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

const refreshUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user || res.data);
      } catch (err) {
        console.log("Auth sync error:", err);
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
      }finally {

      setLoading(false);
    };

  }, [token]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      email,
      password,
    });

    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);

    return res.data;
  };

  const loginWithGoogle = async (googleToken) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
      token: googleToken,
    });

    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginWithGoogle,
        logout,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);