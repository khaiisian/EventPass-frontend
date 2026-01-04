import React, { useEffect, useState } from 'react'
import { getEventTypes, deleteEventType } from "../../../api/eventType.js";
import { Link } from "react-router-dom";

export const EventTypeList = () => {
    const [eventTypes, setEventTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEventTypes = async () => {
        try {
            const response = await getEventTypes();
            setEventTypes(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEventTypes();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this event type?')) {
            return;
        }
        try {
            await deleteEventType(id);
            fetchEventTypes();
        } catch (error) {
            console.log(error);
        }
    }

    if (loading) {
        return (
            <div className="px-4 md:px-6 lg:px-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading event types...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 md:px-6 py-5 border-b border-gray-100 mb-6">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Event Type Management
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base mt-1">
                        View and manage all event types
                    </p>
                </div>
                <Link
                    to="/admin/eventtypes/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition text-sm md:text-base flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Event Type
                </Link>
            </div>

            {/* Table Container */}
            <div className="border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                        <tr>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">EventType Code</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">EventType Name</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-center uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                        {eventTypes.map(eventType => (
                            <tr
                                key={eventType.EventTypeId}
                                className="hover:bg-purple-50/50 transition-colors"
                            >
                                {/* Event Type Code */}
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-900 text-sm md:text-base">
                                        {eventType.EventTypeCode}
                                    </span>
                                </td>

                                {/* Event Type Name */}
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 text-sm md:text-base">
                                        {eventType.EventTypeName}
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 min-w-[140px]">
                                        <Link
                                            to={`/admin/eventtypes/${eventType.EventTypeId}/edit`}
                                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg font-medium transition text-sm flex-1 text-center"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(eventType.EventTypeId)}
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
                {eventTypes.length === 0 && (
                    <div className="py-12 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No event types found</h3>
                        <p className="text-gray-500 text-sm">Get started by adding your first event type.</p>
                    </div>
                )}
            </div>
        </div>
    );
}