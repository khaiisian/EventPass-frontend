import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef
} from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState(null);

    const isRefreshing = useRef(false);
    const failedQueue = useRef([]);

    /* =========================
        HELPER: PROCESS QUEUE
    ========================== */
    const processQueue = (error, newToken = null) => {
        failedQueue.current.forEach(promise => {
            if (error) {
                promise.reject(error);
            } else {
                promise.resolve(newToken);
            }
        });
        failedQueue.current = [];
    };

    /* =========================
        SET AUTH HEADER
    ========================== */
    useEffect(() => {
        if (token) {
            api.defaults.headers.Authorization = `Bearer ${token}`;
            fetchUser();
        } else {
            delete api.defaults.headers.Authorization;
            setLoadingUser(false);
        }
    }, [token]);

    /* =========================
        AXIOS INTERCEPTOR
    ========================== */
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                if (
                    error.response?.status === 401 &&
                    !originalRequest._retry &&
                    token
                ) {
                    if (isRefreshing.current) {
                        return new Promise((resolve, reject) => {
                            failedQueue.current.push({ resolve, reject });
                        }).then(newToken => {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return api(originalRequest);
                        });
                    }

                    originalRequest._retry = true;
                    isRefreshing.current = true;

                    try {
                        const res = await api.post("/auth/refresh");
                        const newToken = res.data.token;

                        localStorage.setItem("token", newToken);
                        setToken(newToken);
                        api.defaults.headers.Authorization = `Bearer ${newToken}`;

                        processQueue(null, newToken);
                        return api(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError, null);
                        forceLogout();
                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing.current = false;
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [token]);

    /* =========================
        FETCH USER
    ========================== */
    const fetchUser = async () => {
        setLoadingUser(true);
        try {
            const res = await api.get("/auth/me");
            setUser(res.data.user);
        } catch (err) {
            console.error(err);
            forceLogout();
        } finally {
            setLoadingUser(false);
        }
    };

    /* =========================
        LOGIN
    ========================== */
    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/auth/login", {
                Email: email,
                Password: password,
            });

            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);

            const userRes = await api.get("/auth/me");
            setUser(userRes.data.user);

            if (userRes.data.user.Role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/homepage");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    /* =========================
        REGISTER
    ========================== */
    const register = async (form) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/auth/register", {
                UserName: form.username,
                Password: form.password,
                Password_confirmation: form.passwordconfirmation,
                PhNumber: form.phnumber,
                Email: form.email,
            });

            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);

            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    /* =========================
        LOGOUT (USER ACTION)
    ========================== */
    const logout = async () => {
        try {
            if (token) {
                await api.post("/auth/logout");
            }
        } catch (err) {
            console.error(err);
        }
        forceLogout();
    };

    /* =========================
        FORCE LOGOUT (SYSTEM)
    ========================== */
    const forceLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        navigate("/login");
    };

    /* =========================
        UPDATE USER INFO
    ========================== */
    const updateUserInfo = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                loadingUser,
                error,
                login,
                register,
                logout,
                fetchUser,
                updateUserInfo,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
