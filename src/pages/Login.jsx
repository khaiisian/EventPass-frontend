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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md transition-transform transform hover:scale-105"
            >
                <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Login</h2>

                {error && (
                    <div className="text-red-600 bg-red-100 border border-red-300 p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <div className="mb-5">
                    <label className="block text-gray-700 mb-2 font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-medium">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                        placeholder="********"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full p-3 rounded-lg text-white font-semibold transition ${
                        loading
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="mt-6 text-center text-gray-500">
                    Don’t have an account?{' '}
                    <a href="/register" className="text-blue-600 hover:underline font-medium">
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    );
}
