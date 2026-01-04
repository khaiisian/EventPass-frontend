import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEvent } from "../../../api/event.js";
import { getEventTypes } from "../../../api/eventType.js";
import { getVenues } from "../../../api/venue.js";
import { getOrganizers } from "../../../api/organizer.js";

export const CreateEvent = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [eventTypes, setEventTypes] = useState([]);
    const [venues, setVenues] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        EventTypeId: "",
        VenueId: "",
        EventName: "",
        OrganizerId: "",
        StartDate: "",
        EndDate: "",
        IsActive: true,
        EventStatus: 0,
        TotalTicketQuantity: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [eventTypesRes, venuesRes, organizersRes] = await Promise.all([
                    getEventTypes(),
                    getVenues(),
                    getOrganizers()
                ]);
                setEventTypes(eventTypesRes.data.data);
                setVenues(venuesRes.data.data);
                setOrganizers(organizersRes.data.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load required data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        setError(null);
        e.preventDefault();

        // Validate end date is after start date
        if (form.StartDate && form.EndDate) {
            const startDate = new Date(form.StartDate);
            const endDate = new Date(form.EndDate);
            if (endDate < startDate) {
                setError("End date must be after or equal to start date");
                return;
            }
        }

        const formData = new FormData();
        for (const key in form) {
            if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
                // Convert boolean to 1/0 for PHP
                if (key === 'IsActive') {
                    formData.append(key, form[key] ? 1 : 0);
                } else {
                    formData.append(key, form[key]);
                }
            }
        }

        try {
            await createEvent(formData);
            navigate("/admin/events");
        } catch (err) {
            console.error(err.response?.data);
            setError(err.response?.data?.message || "Error creating event");
        }
    };

    const handleOnChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setForm((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    if (loading) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="mt-6 border border-gray-200 shadow-xl rounded-2xl overflow-hidden bg-white p-8 max-w-4xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">Loading data...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="mt-6 border border-gray-200 shadow-xl rounded-2xl overflow-hidden bg-white p-6 md:p-8 max-w-4xl mx-auto">
                {/* Header - Improved spacing and alignment */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-100">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Event</h1>
                        <p className="text-gray-500 mt-2">Add a new event to the system</p>
                    </div>
                    <Link
                        to="/admin/events"
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-base font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to List
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && <div className="text-red-600 mb-4 p-4 bg-red-50 rounded-lg">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Event Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="EventName" className="block font-medium text-gray-700">
                                Event Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="EventName"
                                value={form.EventName}
                                name="EventName"
                                onChange={handleOnChange}
                                required
                                placeholder="Enter event name"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Event Type Field */}
                        <div className="space-y-2">
                            <label htmlFor="EventTypeId" className="block font-medium text-gray-700">
                                Event Type <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="EventTypeId"
                                    name="EventTypeId"
                                    onChange={handleOnChange}
                                    value={form.EventTypeId}
                                    required
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none cursor-pointer pr-10"
                                >
                                    <option value="">Select event type</option>
                                    {eventTypes.map(eventType => (
                                        <option
                                            key={eventType.EventTypeId}
                                            value={eventType.EventTypeId}
                                            className="py-2"
                                        >
                                            {eventType.EventTypeName}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Venue Field */}
                        <div className="space-y-2">
                            <label htmlFor="VenueId" className="block font-medium text-gray-700">
                                Venue <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="VenueId"
                                    name="VenueId"
                                    onChange={handleOnChange}
                                    value={form.VenueId}
                                    required
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none cursor-pointer pr-10"
                                >
                                    <option value="">Select venue</option>
                                    {venues.map(venue => (
                                        <option
                                            key={venue.VenueId}
                                            value={venue.VenueId}
                                            className="py-2"
                                        >
                                            {venue.VenueName}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Organizer Field - Updated to dropdown */}
                        <div className="space-y-2">
                            <label htmlFor="OrganizerId" className="block font-medium text-gray-700">
                                Organizer (Optional)
                            </label>
                            <div className="relative">
                                <select
                                    id="OrganizerId"
                                    name="OrganizerId"
                                    onChange={handleOnChange}
                                    value={form.OrganizerId}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none cursor-pointer pr-10"
                                >
                                    <option value="">Select organizer</option>
                                    {organizers.map(organizer => (
                                        <option
                                            key={organizer.OrganizerId}
                                            value={organizer.OrganizerId}
                                            className="py-2"
                                        >
                                            {organizer.OrganizerName || `Organizer #${organizer.OrganizerId}`}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Start Date Field */}
                        <div className="space-y-2">
                            <label htmlFor="StartDate" className="block font-medium text-gray-700">
                                Start Date (Optional)
                            </label>
                            <input
                                type="datetime-local"
                                id="StartDate"
                                value={form.StartDate}
                                name="StartDate"
                                onChange={handleOnChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* End Date Field */}
                        <div className="space-y-2">
                            <label htmlFor="EndDate" className="block font-medium text-gray-700">
                                End Date (Optional)
                            </label>
                            <input
                                type="datetime-local"
                                id="EndDate"
                                value={form.EndDate}
                                name="EndDate"
                                onChange={handleOnChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Total Ticket Quantity Field */}
                        <div className="space-y-2">
                            <label htmlFor="TotalTicketQuantity" className="block font-medium text-gray-700">
                                Total Tickets <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="TotalTicketQuantity"
                                value={form.TotalTicketQuantity}
                                name="TotalTicketQuantity"
                                onChange={handleOnChange}
                                required
                                min="0"
                                placeholder="Enter total ticket quantity"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Event Status Field */}
                        <div className="space-y-2">
                            <label htmlFor="EventStatus" className="block font-medium text-gray-700">
                                Event Status (Optional)
                            </label>
                            <select
                                id="EventStatus"
                                name="EventStatus"
                                value={form.EventStatus}
                                onChange={handleOnChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors bg-white"
                            >
                                <option value="0">Pending</option>
                                <option value="1">Upcoming</option>
                                <option value="2">Ongoing</option>
                                <option value="3">Completed</option>
                                <option value="4">Cancelled</option>
                            </select>
                        </div>

                        {/* Is Active Checkbox */}
                        <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="IsActive"
                                    name="IsActive"
                                    checked={form.IsActive}
                                    onChange={handleOnChange}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <label htmlFor="IsActive" className="ml-2 block font-medium text-gray-700">
                                    Active Event
                                </label>
                            </div>
                            <p className="text-sm text-gray-500 ml-6">
                                Check this box to make the event active immediately
                            </p>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h4 className="text-blue-800 font-medium mb-1">Event Information</h4>
                                <p className="text-blue-700 text-sm">
                                    Create a new event with all necessary details. Required fields are marked with a red asterisk (*).
                                    Organizer selection is optional. If no organizer is selected, the event will be created without an organizer.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                        <Link
                            to="/admin/events"
                            className="px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl text-base font-semibold transition-colors shadow-sm hover:shadow-md"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};