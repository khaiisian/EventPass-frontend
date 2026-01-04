import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEventType } from "../../../api/eventType.js";

export const CreateEventType = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        EventTypeName: "",
    });

    const handleSubmit = async (e) => {
        setError(null);
        e.preventDefault();

        try {
            await createEventType(form);
            navigate("/admin/eventtypes");
        } catch (err) {
            console.error(err.response?.data);
            setError(err.response?.data?.message || "Error creating event type");
        }
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="mt-6 border border-gray-200 shadow-xl rounded-2xl overflow-hidden bg-white p-6 md:p-8 max-w-4xl mx-auto">
                {/* Header - Improved spacing and alignment */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-100">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Event Type</h1>
                        <p className="text-gray-500 mt-2">Add a new event type to the system</p>
                    </div>
                    <Link
                        to="/admin/eventtypes"
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-base font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to List
                    </Link>
                </div>

                {/* Form - Improved grid and spacing */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && <div className="text-red-600 mb-4">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Event Type Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="EventTypeName" className="block font-medium text-gray-700">
                                Event Type Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="EventTypeName"
                                value={form.EventTypeName}
                                name="EventTypeName"
                                onChange={handleOnChange}
                                required
                                placeholder="Enter event type name"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Empty column for alignment - or you can add more fields if needed */}
                        <div></div>

                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h4 className="text-blue-800 font-medium mb-1">Event Type Information</h4>
                                <p className="text-blue-700 text-sm">
                                    Event types categorize different kinds of events in the system.
                                    Examples: "Conference", "Wedding", "Birthday Party", "Corporate Meeting", etc.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                        <Link
                            to="/admin/eventtypes"
                            className="px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl text-base font-semibold transition-colors shadow-sm hover:shadow-md"
                        >
                            Create Event Type
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};