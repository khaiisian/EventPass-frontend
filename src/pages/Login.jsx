// src/pages/Login.jsx
import { useState } from 'react';
import useAuth from '../auth/useAuth';

export default function Login() {
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        login(email, password);
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-slate-200">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transition-transform transform hover:scale-[1.02]"
            >
                <h2 className="text-3xl font-extrabold mb-6 text-center text-slate-800">
                    Login
                </h2>

                {error && (
                    <div className="text-rose-700 bg-rose-100 border border-rose-200 p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <div className="mb-5">
                    <label className="block text-slate-700 mb-2 font-medium">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full border border-slate-300 p-3 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-purple-500
                               focus:border-transparent transition"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-slate-700 mb-2 font-medium">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full border border-slate-300 p-3 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-purple-500
                               focus:border-transparent transition"
                        placeholder="********"
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
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="mt-6 text-center text-slate-500">
                    Don’t have an account?{' '}
                    <a
                        href="/register"
                        className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                    >
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    );


}
