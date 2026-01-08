import React, { useEffect, useState } from 'react'
import { getEvents, deleteEvent } from "../../../api/event.js";
import { Link } from "react-router-dom";

export const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const fetchEvents = async (page = 1) => {
        try {
            const response = await getEvents({ page, per_page: 10 });
            setEvents(response.data.data);
            setPagination(response.data.meta || {
                current_page: page,
                last_page: 1,
                per_page: 10,
                total: response.data.data.length
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) {
            return;
        }
        try {
            await deleteEvent(id);
            fetchEvents(pagination.current_page);
        } catch (error) {
            console.log(error);
        }
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
            fetchEvents(page);
        }
    }

    if (loading) {
        return (
            <div className="px-4 md:px-6 lg:px-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading events...</div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    const getStatusBadgeColor = (status, isActive) => {
        if (!isActive) return 'bg-gray-100 text-gray-700 border-gray-200';

        switch (status) {
            case 'UPCOMING':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ONGOING':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'COMPLETED':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    }

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Events</h1>
                    <p className="text-gray-600 mt-1">
                        Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                        {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                        of {pagination.total} events
                    </p>
                </div>
                <Link
                    to="/admin/events/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Event
                </Link>
            </div>

            {/* Table Container */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-white">Event Code</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Event Name</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Type</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Venue</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Dates</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Tickets</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Status</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {events.map(event => (
                            <tr
                                key={event.EventId}
                                className="border-b border-gray-100 hover:bg-gray-50"
                            >
                                {/* Code */}
                                <td className="py-5 px-6">
                                    <div className="font-mono font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded text-sm inline-block">
                                        {event.EventCode}
                                    </div>
                                </td>

                                {/* Event Name */}
                                <td className="py-5 px-6">
                                    <div className="font-medium text-gray-900">
                                        {event.EventName}
                                    </div>
                                </td>

                                {/* Type */}
                                <td className="py-5 px-6">
                                    <div className="text-gray-700">
                                        {event.EventType?.EventTypeName || '-'}
                                    </div>
                                </td>

                                {/* Venue */}
                                <td className="py-5 px-6">
                                    <div className="text-gray-700">
                                        {event.Venue?.VenueName || '-'}
                                    </div>
                                </td>

                                {/* Dates */}
                                <td className="py-5 px-6">
                                    <div className="space-y-1">
                                        <div className="text-sm">
                                            <span className="text-gray-500">Start: </span>
                                            <span className="font-medium">{formatDate(event.StartDate)}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-500">End: </span>
                                            <span className="font-medium">{formatDate(event.EndDate)}</span>
                                        </div>
                                    </div>
                                </td>

                                {/* Tickets */}
                                <td className="py-5 px-6">
                                    <div className="space-y-2">
                                        <div className="text-sm">
                                            <span className="text-gray-500">Sold: </span>
                                            <span className="font-medium">{event.SoldOutTicketQuantity || 0}/{event.TotalTicketQuantity || 0}</span>
                                        </div>
                                        {event.TotalTicketQuantity > 0 && (
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${((event.SoldOutTicketQuantity || 0) / event.TotalTicketQuantity * 100)}%`
                                                    }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="py-5 px-6">
                                    <div className="space-y-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(event.EventStatus, event.IsActive)}`}>
                                                {event.EventStatus || 'PENDING'}
                                            </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            event.IsActive
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                                        }`}>
                                                {event.IsActive ? 'Active' : 'Inactive'}
                                            </span>
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="py-5 px-6">
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/admin/events/${event.EventId}/edit`}
                                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(event.EventId)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {events.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-500">Get started by adding your first event.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
                <div className="flex justify-between items-center mt-6 px-4 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                        {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                        of {pagination.total} events
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                pagination.current_page === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Previous
                        </button>

                        <div className="flex gap-1">
                            {[...Array(pagination.last_page)].map((_, index) => {
                                const pageNum = index + 1;
                                if (
                                    pageNum === 1 ||
                                    pageNum === pagination.last_page ||
                                    (pageNum >= pagination.current_page - 1 && pageNum <= pagination.current_page + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium ${
                                                pagination.current_page === pageNum
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                }
                                if (
                                    (pageNum === 2 && pagination.current_page > 3) ||
                                    (pageNum === pagination.last_page - 1 && pagination.current_page < pagination.last_page - 2)
                                ) {
                                    return <span key={pageNum} className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                pagination.current_page === pagination.last_page
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}