import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const Navbar = () => {
    const { user, token, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getUserInitials = () => {
        if (!user?.UserName) return 'U';
        return user.UserName.charAt(0).toUpperCase();
    };

    const getUserImage = () => {
        return user?.UserImage || null;
    };

    return (
        <nav className="bg-gray-900 text-gray-100 flex justify-between items-center px-6 py-4 shadow-2xl border-b border-gray-800">
            <Link
                to={token ? "/dashboard" : "/"}
                className="font-bold text-4xl text-purple-500 hover:text-purple-400 transition-colors"
            >
                EventPass
            </Link>

            <div className="flex gap-4 items-center">
                {token ? (
                    <>
                        <div className="hidden md:flex gap-4">
                            {/*<Link*/}
                            {/*    to="/dashboard"*/}
                            {/*    className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"*/}
                            {/*>*/}
                            {/*    Dashboard*/}
                            {/*</Link>*/}

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
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center ring-2 ring-gray-800 gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {/* User Avatar on LEFT */}
                                <div className="relative">
                                    {getUserImage() ? (
                                        <img
                                            src={getUserImage()}
                                            alt={user?.UserName}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-purple-400">
                                            {getUserInitials()}
                                        </div>
                                    )}
                                </div>

                                {/* User Info on RIGHT */}
                                <div className="hidden md:block text-left">
                                    <div className="text-sm font-medium text-white">
                                        {user?.UserName || 'User'}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {user?.UserEmail || ''}
                                    </div>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2 z-50 border border-gray-700">
                                    <div className="px-4 py-3 border-b border-gray-700">
                                        <div className="text-sm font-medium text-white">
                                            {user?.UserName || 'User'}
                                        </div>
                                        <div className="text-xs text-gray-400 truncate">
                                            {user?.UserEmail || ''}
                                        </div>
                                    </div>

                                    <Link
                                        to="/editprofile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Edit Profile</span>
                                    </Link>

                                    <button
                                        onClick={() => {
                                            logout();
                                            setDropdownOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-700 transition-colors w-full text-left"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
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