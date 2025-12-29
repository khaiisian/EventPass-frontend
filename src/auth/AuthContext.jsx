import React, {createContext ,useContext, useState, useEffect} from "react";
import api from "../api/axios.js";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if(token){
            api.defaults.headers.Authorization = `Bearer ${token}`;
            fetchUser();
        }
    }, [token]);

    const fetchUser = async () => {
        setLoadingUser(true);
        try {
            const res = await api.get("/auth/me");
            setUser(res.data.user);
            console.log(res.data.user);
        } catch (err) {
            console.log(err);
            logout();
        } finally {
            setLoadingUser(false);
        }
    };

    const register = async (form) => {
        setLoading(true);
        setError(null);
        try{
            const res = await api.post("/auth/register", {
                UserName: form.username,
                Password: form.password,
                Password_confirmation: form.passwordconfirmation,
                PhNumber: form.phnumber,
                Email: form.email,
            });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            navigate("/dashboard");
        } catch(err){
            console.log(err);
            setError(err.response?.response?.data?.message || "Registration Failed");
        } finally {
            setLoading(false);
        }
    }

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try{
            const res = await api.post("/auth/login", {
                Email: email,
                Password: password,
            });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            await fetchUser();
            navigate("/dashboard");
        } catch(err){
            console.log(err);
            setError(err.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        setLoading(true);
        setError(null);
        try{
            if(token){
                await api.post("/auth/logout");
            }
        } catch(err){
            console.log(err);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setLoading(false);
            navigate("/login");
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, fetchUser, loadingUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};