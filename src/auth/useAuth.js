import React from 'react'
import {useState} from "react";
import api from "../api/axios";
import {useNavigate} from "react-router-dom";

const UseAuth = () =>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try{
            const res = await api.post("/auth/login", {
                Email: email,
                Password: password
            });
            localStorage.setItem("token", res.data.token);
            console.log(res.data.token);
            navigate("/dashboard");
        } catch(error){
            console.log(error);
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return {login, logout, error, loading};
}
export default UseAuth
