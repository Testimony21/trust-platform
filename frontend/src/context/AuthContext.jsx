import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(res.data);
            } catch (err) {
                console.log(err);
                setToken(null);
                localStorage.removeItem("token");
            }

            setLoading(false);
        };

        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        console.log("AUTH LOGIN CALLED:", email, password);

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            email,
            password
        });

        console.log("SERVER RESPONSE:", res.data);


        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);

        return res.data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);