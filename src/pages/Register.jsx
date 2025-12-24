import React from 'react'
import {useState} from 'react'
import useAuth from "../auth/useAuth.js";
import App from "../App.jsx";

export const Register = () => {
    const {register, loading, error} = useAuth();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        passwordconfirmation: "",
        phnumber: ""
    });


    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        register(form);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-slate-200">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm"
            >
                <h2 className="text-2xl font-extrabold mb-6 text-center text-slate-800">
                    Register
                </h2>

                {error && (
                    <div className="text-rose-700 bg-rose-100 border border-rose-200 p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-1 text-slate-700 font-medium">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full border border-slate-300 p-2 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-purple-500
                               focus:border-transparent transition"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-slate-700 font-medium">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        name="phnumber"
                        value={form.phnumber}
                        onChange={handleChange}
                        className="w-full border border-slate-300 p-2 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-purple-500
                               focus:border-transparent transition"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-slate-700 font-medium">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-slate-300 p-2 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-purple-500
                               focus:border-transparent transition"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-slate-700 font-medium">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border border-slate-300 p-2 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-purple-500
                               focus:border-transparent transition"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 text-slate-700 font-medium">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        name="passwordconfirmation"
                        value={form.passwordconfirmation}
                        onChange={handleChange}
                        className="w-full border border-slate-300 p-2 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-purple-500
                               focus:border-transparent transition"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full p-3 rounded-lg text-white font-semibold transition
                    ${loading
                        ? 'bg-purple-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'}
                `}
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );

}

export default Register;


