import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../auth/AuthContext.jsx";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const linkClass = path =>
        `px-4 py-3 rounded-xl transition-all duration-300
        ${location.pathname === path
            ? 'bg-purple-600 text-white shadow-lg'
            : 'text-gray-300 hover:bg-gray-700 hover:text-purple-400'
        }`;

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <aside className="w-64 min-h-screen bg-gray-900 flex flex-col shadow-2xl border-r border-gray-800">
            {/* Brand & User Info */}
            <div className="px-6 py-6 border-b border-gray-800">
                <h1 className="text-3xl font-extrabold text-purple-500 tracking-wide">
                    EventPass
                </h1>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider">
                    Admin Panel
                </p>

                {/* User Info */}
                {user && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                                {user.ProfileImg ? (
                                    <img
                                        src={user.ProfileImg}
                                        alt={user.UserName}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white font-bold text-sm">
                                        {user.UserName?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {/* User Details */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm truncate">
                                    {user.UserName}
                                </p>
                                <p className="text-gray-400 text-xs truncate">
                                    {user.Email}
                                </p>
                                <p className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                                    user.Role === 'ADMIN'
                                        ? 'bg-purple-900 text-purple-300'
                                        : 'bg-gray-800 text-gray-300'
                                }`}>
                                    {user.Role}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 px-4 py-6 text-base font-semibold">
                <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                    Dashboard
                </Link>

                <Link to="/admin/users" className={linkClass('/admin/users')}>
                    Users
                </Link>

                <Link to="/admin/venuetypes" className={linkClass('/admin/venuetypes')}>
                    Venue Types
                </Link>

                <Link to="/admin/venues" className={linkClass('/admin/venues')}>
                    Venues
                </Link>

                <Link to="/admin/organizers" className={linkClass('/admin/organizers')}>
                    Organizers
                </Link>

                <Link to="/admin/eventtypes" className={linkClass('/admin/eventtypes')}>
                    Event Types
                </Link>

                <Link to="/admin/events" className={linkClass('/admin/events')}>
                    Events
                </Link>
            </nav>

            {/* Logout Button */}
            <div className="mt-auto px-4 py-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-800 text-sm text-gray-500">
                © {new Date().getFullYear()} EventPass
            </div>
        </aside>
    );
};

export default Sidebar;