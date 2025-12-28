import { useState } from 'react';
import { Link } from 'react-router-dom'; // add this
import { useAuth } from '../auth/AuthContext'; // updated import

export default function Login() {
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md transition-transform transform hover:scale-[1.02]"
            >
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-100">
                    Login
                </h2>

                {error && (
                    <div className="text-rose-300 bg-rose-900/20 border border-rose-700 p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <div className="mb-5">
                    <label className="block text-gray-300 mb-2 font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full border border-gray-600 bg-gray-700 text-gray-100 p-3 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-purple-500
                       focus:border-transparent transition"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-300 mb-2 font-medium">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full border border-gray-600 bg-gray-700 text-gray-100 p-3 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-purple-500
                       focus:border-transparent transition"
                        placeholder="********"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full p-3 rounded-lg text-white font-semibold transition
            ${loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="mt-6 text-center text-gray-400">
                    Don’t have an account?{' '}
                    <Link
                        to="/register"
                        className="text-purple-400 hover:text-purple-500 hover:underline font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}
