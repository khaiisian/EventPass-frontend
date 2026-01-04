import React, { useEffect, useState } from 'react'
import { getEvents, deleteEvent } from "../../../api/event.js";
import { Link } from "react-router-dom";

export const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const response = await getEvents();
            setEvents(response.data.data);
            console.log(response.data.data);
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
            fetchEvents();
        } catch (error) {
            console.log(error);
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

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
        <div className="px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 md:px-6 py-5 border-b border-gray-100 mb-6">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Event Management
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base mt-1">
                        View and manage all events
                    </p>
                </div>
                <Link
                    to="/admin/events/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition text-sm md:text-base flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Event
                </Link>
            </div>

            {/* Table Container */}
            <div className="border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                        <tr>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">Event Code</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">Event Name</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">Type</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">Venue</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">Dates</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">Tickets</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">Status</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-center uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                        {events.map(event => (
                            <tr
                                key={event.EventId}
                                className="hover:bg-purple-50/50 transition-colors"
                            >
                                {/* Event Code */}
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-900 text-sm md:text-base">
                                        {event.EventCode}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 text-sm md:text-base">
                                        {event.EventName}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="text-gray-600 text-sm md:text-base">
                                        {event.EventType?.EventTypeName || '-'}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="text-gray-600 text-sm md:text-base">
                                        {event.Venue?.VenueName || '-'}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="text-gray-600 text-sm">
                                        <div className="font-medium">Start:</div>
                                        <div>{formatDate(event.StartDate)}</div>
                                        <div className="font-medium mt-2">End:</div>
                                        <div>{formatDate(event.EndDate)}</div>
                                    </div>
                                </td>

                                {/* Tickets */}
                                <td className="px-6 py-4">
                                    <div className="text-gray-600 text-sm">
                                        <div>Total: {event.TotalTicketQuantity || 0}</div>
                                        <div>Sold: {event.SoldOutTicketQuantity || 0}</div>
                                        <div className="mt-1">
                                            {event.TotalTicketQuantity > 0 && (
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${((event.SoldOutTicketQuantity || 0) / event.TotalTicketQuantity * 100)}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(event.EventStatus, event.IsActive)}`}>
                                            {event.EventStatus || 'PENDING'}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                            event.IsActive
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                                        }`}>
                                            {event.IsActive ? 'Active' : 'Inactive'}
                                        </span>
                                        {event.DeleteFlag && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                                                Deleted
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 min-w-[140px]">
                                        <Link
                                            to={`/admin/events/${event.EventId}/edit`}
                                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg font-medium transition text-sm flex-1 text-center"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(event.EventId)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition text-sm flex-1 text-center"
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
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-500 text-sm">Get started by adding your first event.</p>
                    </div>
                )}
            </div>
        </div>
    );
}