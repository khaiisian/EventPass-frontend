import { useState, useEffect } from 'react';
import { getDashboard } from "../../../api/dashboard.js";
import { useAuth } from "../../../auth/AuthContext.jsx";
import Highcharts from "highcharts";
import { useNavigate } from "react-router-dom";
import HighchartsReact from "highcharts-react-official";

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [revenueCategories, setRevenueCategories] = useState([]);
    const [revenueSeries, setRevenueSeries] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await getDashboard();
            const data = response.data.data;

            setDashboardData(data);

            if (data?.daily_revenue) {
                setRevenueCategories(
                    data.daily_revenue.map(item => item.date)
                );

                setRevenueSeries(
                    data.daily_revenue.map(item => Number(item.revenue))
                );
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const revenueChartOptions = {
        title: {
            text: "Daily Ticket Revenue",
            align: "left"
        },

        subtitle: {
            text: "Successful transactions only",
            align: "left"
        },

        xAxis: {
            categories: revenueCategories,
            title: { text: "Date" }
        },

        yAxis: {
            title: { text: "Revenue" }
        },

        tooltip: {
            valuePrefix: "Ks "
        },

        series: [
            {
                name: "Revenue",
                data: revenueSeries
            }
        ]
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading dashboard data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Header with user info */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Welcome back, {user?.UserName || 'User'}!
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Here's what's happening with your platform today.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Events Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Events</h3>
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">
                            {dashboardData?.total_events || 0}
                        </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">From last month</span>
                    </div>
                </div>

                {/* Active Users Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Users</h3>
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10.953 10.953 0 01-.671-3.626m0 0A10.999 10.999 0 1012 21a10.999 10.999 0 00.67-7.623z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">
                            {dashboardData?.total_active_users || 0}
                        </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">From last month</span>
                    </div>
                </div>

                {/* Total Organizers Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Organizers</h3>
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">
                            {dashboardData?.total_organizers || 0}
                        </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Active organizers</span>
                    </div>
                </div>

                {/* Total Venues Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Venues</h3>
                        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">
                            {dashboardData?.total_venues || 0}
                        </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Available venues</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Revenue Over Time
                </h2>

                {revenueSeries.length === 0 ? (
                    <div className="text-gray-500 text-center py-12">
                        No revenue data available
                    </div>
                ) : (
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={revenueChartOptions}
                    />
                )}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-sm p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Venue Management</h3>
                    <p className="text-gray-600 text-sm mb-4">Create, edit, or review venues</p>
                    <button
                        onClick={() => navigate("/admin/venues")}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                    >
                        Manage Venue
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-white rounded-xl shadow-sm p-6 border border-purple-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Venue Management</h3>
                    <p className="text-gray-600 text-sm mb-4">Create, edit, or review upcoming events</p>
                    <button
                        onClick={() => navigate("/admin/events")}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
                    >
                        Go to Events
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                </div>

                <div className="bg-gradient-to-r from-green-50 to-white rounded-xl shadow-sm p-6 border border-green-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                    <p className="text-gray-600 text-sm mb-4">Manage users and permissions</p>
                    <button
                        onClick={() => navigate("/admin/users")}
                        className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                    >
                        Manage Users
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}