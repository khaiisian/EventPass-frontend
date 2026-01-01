import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const linkClass = path =>
        `px-4 py-3 rounded-xl transition-all duration-300
        ${location.pathname === path
            ? 'bg-purple-600 text-white shadow-lg'
            : 'text-gray-300 hover:bg-gray-700 hover:text-purple-400'
        }`;

    return (
        <aside className="w-64 min-h-screen bg-gray-900 flex flex-col shadow-2xl border-r border-gray-800">
            {/* Brand */}
            <div className="px-6 py-6 border-b border-gray-800">
                <h1 className="text-3xl font-extrabold text-purple-500 tracking-wide">
                    EventPass
                </h1>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider">
                    Admin Panel
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 px-4 py-6 text-base font-semibold">
                <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                    Dashboard
                </Link>

                <Link to="/admin/users" className={linkClass('/admin/users')}>
                    Users
                </Link>

                <Link to="/admin/events" className={linkClass('/admin/events')}>
                    Events
                </Link>

                <Link to="/admin/venuetypes" className={linkClass('/admin/venuetypes')}>
                    Venue Types
                </Link>
            </nav>

            {/* Footer */}
            <div className="mt-auto px-6 py-4 border-t border-gray-800 text-sm text-gray-500">
                © {new Date().getFullYear()} EventPass
            </div>
        </aside>
    );
};

export default Sidebar;
