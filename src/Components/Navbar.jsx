import React from 'react';
import { Link } from "react-router-dom";
import {useAuth} from "../auth/AuthContext.jsx";

const Navbar = () => {
    const { user, token, logout } = useAuth();

    return (
        <nav className="bg-gray-800 text-gray-100 flex justify-between items-center px-6 md:px-10 py-5 shadow-2xl">
            <Link
                to="/"
                className="font-bold text-3xl md:text-4xl hover:text-cyan-400 transition-colors duration-300"
            >
                EventPass
            </Link>

            <div className="flex gap-4 md:gap-6 text-lg font-semibold items-center">
                {token ? (
                    <>
                        <Link
                            to="/dashboard"
                            className="hover:text-cyan-400 transition-colors duration-300"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/profile"
                            className="hover:text-cyan-400 transition-colors duration-300"
                        >
                            {user?.UserName || 'UserProfile'}
                        </Link>
                        <button
                            onClick={logout}
                            className="bg-cyan-600 text-gray-100 px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 hover:text-cyan-400 transition-colors duration-300"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 hover:text-purple-300 transition-colors duration-300"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
