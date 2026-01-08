import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";


const Navbar = () => {
    const { user, token, logout } = useAuth();

    return (
        <nav className="bg-gray-900 text-gray-100 flex justify-between items-center px-6 py-4 shadow-2xl border-b border-gray-800">
            <Link
                to="/"
                className="font-bold text-4xl text-purple-500 hover:text-purple-400 transition-colors"
            >
                EventPass
            </Link>

            <div className="flex gap-4 items-center">
                {token ? (
                    <>
                        <Link
                            to="/dashboard"
                            className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/homepage"
                            className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"
                        >
                            Home
                        </Link>

                        <Link
                            to="/venues"
                            className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"
                        >
                            Venues
                        </Link>

                        <Link
                            to="/events"
                            className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"
                        >
                            Events
                        </Link>

                        <Link
                            to="/editprofile"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{user?.UserName || 'Profile'}</span>
                        </Link>

                        <button
                            onClick={logout}
                            className="p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center justify-center"
                            title="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;