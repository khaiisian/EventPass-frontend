import React from 'react';
import { Link } from "react-router-dom";
import useAuth from '../auth/useAuth';

const Navbar = () => {
    const token = localStorage.getItem("token");
    const { logout } = useAuth();

    return (
        <nav className="bg-gray-900 text-gray-100 flex justify-between items-center px-6 md:px-10 py-5 shadow-lg">
            {/* Logo */}
            <Link
                to="/"
                className="font-bold text-3xl md:text-4xl hover:text-gray-400 transition-colors duration-300"
            >
                EventPass
            </Link>

            {/* Links */}
            <div className="flex gap-6 md:gap-10 text-lg font-semibold items-center">
                {token ? (
                    <>
                        <Link
                            to="/dashboard"
                            className="hover:text-gray-400 transition-colors duration-300"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={logout}
                            className="bg-gray-700 text-gray-100 px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition-colors duration-300"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="bg-gray-700 text-gray-100 px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition-colors duration-300"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>

    );
};

export default Navbar;
