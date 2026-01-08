import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../../api/event.js";
import { getEventTypes } from "../../../api/eventType.js";
import { getVenues } from "../../../api/venue.js";
import { getOrganizers } from "../../../api/organizer.js";

export const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [eventTypes, setEventTypes] = useState([]);
    const [venues, setVenues] = useState([]);
    const [organizers, setOrganizers] = useState([]);

    const [ticketTypes, setTicketTypes] = useState([]);

    const [form, setForm] = useState({
        EventTypeId: "",
        VenueId: "",
        EventName: "",
        OrganizerId: "",
        StartDate: "",
        EndDate: "",
        IsActive: true,
        EventStatus: "0",
        TotalTicketQuantity: 0,
        EventImage: null,
        ExistingEventImage: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventTypesRes, venuesRes, organizersRes] = await Promise.all([
                    getEventTypes(),
                    getVenues(),
                    getOrganizers()
                ]);
                setEventTypes(eventTypesRes.data.data);
                setVenues(venuesRes.data.data);
                setOrganizers(organizersRes.data.data);

                const eventRes = await getEventById(id);
                const event = eventRes.data.data;

                console.log("Event data:", event);

                const formatDateForInput = (dateString) => {
                    if (!dateString) return "";
                    const date = new Date(dateString);
                    return date.toISOString().slice(0, 16);
                };

                setForm(prev => ({
                    ...prev,
                    EventTypeId: event.EventTypeId || "",
                    VenueId: event.VenueId || "",
                    EventName: event.EventName || "",
                    OrganizerId: event.OrganizerId || "",
                    StartDate: formatDateForInput(event.StartDate),
                    EndDate: formatDateForInput(event.EndDate),
                    IsActive: event.IsActive || true,
                    EventStatus: event.EventStatus?.toString() || "0",
                    TotalTicketQuantity: event.TotalTicketQuantity || 0,
                    ExistingEventImage: event.EventImage || null, // Store existing image URL
                }));

                if (event.TicketType && event.TicketType.length > 0) {
                    const formattedTicketTypes = event.TicketType.map((ticket, index) => ({
                        id: index + 1,
                        TicketTypeId: ticket.TicketTypeId,
                        TicketTypeCode: ticket.TicketTypeCode || "",
                        TicketTypeName: ticket.TicketTypeName || "",
                        Price: parseFloat(ticket.Price) || 0,
                        TotalQuantity: parseInt(ticket.TotalQuantity) || 0,
                        isValid: true
                    }));
                    setTicketTypes(formattedTicketTypes);
                } else {
                    setTicketTypes([{
                        id: 1,
                        TicketTypeId: null,
                        TicketTypeCode: "",
                        TicketTypeName: '',
                        Price: 0,
                        TotalQuantity: 0,
                        isValid: false
                    }]);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load event data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const total = ticketTypes.reduce((sum, ticket) => sum + (parseInt(ticket.TotalQuantity) || 0), 0);
        setForm(prev => ({ ...prev, TotalTicketQuantity: total }));
    }, [ticketTypes]);

    const handleTicketTypeChange = (id, field, value) => {
        setTicketTypes(prev => prev.map(ticket => {
            if (ticket.id === id) {
                const updated = { ...ticket, [field]: value };

                const isValid = updated.TicketTypeName.trim() !== '' &&
                    updated.Price >= 0 &&
                    updated.TotalQuantity > 0;

                return { ...updated, isValid };
            }
            return ticket;
        }));
    };

    const addTicketType = () => {
        const newId = ticketTypes.length > 0 ? Math.max(...ticketTypes.map(t => t.id)) + 1 : 1;
        setTicketTypes(prev => [
            ...prev,
            {
                id: newId,
                TicketTypeId: null,
                TicketTypeCode: "",
                TicketTypeName: '',
                Price: 0,
                TotalQuantity: 0,
                isValid: false
            }
        ]);
    };

    const removeTicketType = (id) => {
        if (ticketTypes.length > 1) {
            setTicketTypes(prev => prev.filter(ticket => ticket.id !== id));
        }
    };

    const handleOnChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (name === "EventImage") {
            setForm((prev) => ({
                ...prev,
                EventImage: files[0] || null
            }));
        } else if (type === 'checkbox') {
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setForm((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const hasValidTickets = ticketTypes.some(ticket => ticket.isValid);
        if (!hasValidTickets) {
            setError("Please add at least one valid ticket type with name, price, and quantity");
            return;
        }

        if (form.StartDate && form.EndDate) {
            const startDate = new Date(form.StartDate);
            const endDate = new Date(form.EndDate);
            if (endDate < startDate) {
                setError("End date must be after or equal to start date");
                return;
            }
        }

        const validTicketTypes = ticketTypes
            .filter(t => t.isValid)
            .map(ticket => ({
                TicketTypeCode: ticket.TicketTypeCode || null,
                TicketTypeName: ticket.TicketTypeName,
                Price: parseFloat(ticket.Price),
                TotalQuantity: parseInt(ticket.TotalQuantity)
            }));

        const formData = new FormData();

        formData.append("_method", "PUT");

        const fieldsToSend = ['EventTypeId', 'VenueId', 'EventName', 'OrganizerId', 'StartDate', 'EndDate', 'IsActive', 'EventStatus', 'TotalTicketQuantity'];

        fieldsToSend.forEach(field => {
            if (form[field] !== null && form[field] !== undefined && form[field] !== "") {
                if (field === 'IsActive') {
                    formData.append(field, form[field] ? 1 : 0);
                } else {
                    formData.append(field, form[field]);
                }
            }
        });

        if (form.EventImage instanceof File) {
            formData.append("EventImage", form.EventImage);
        }

        validTicketTypes.forEach((ticket, index) => {
            formData.append(`TicketTypes[${index}][TicketTypeCode]`, ticket.TicketTypeCode || '');
            formData.append(`TicketTypes[${index}][TicketTypeName]`, ticket.TicketTypeName);
            formData.append(`TicketTypes[${index}][Price]`, ticket.Price.toString());
            formData.append(`TicketTypes[${index}][TotalQuantity]`, ticket.TotalQuantity.toString());
        });

        console.log('FormData entries for update:');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            console.log('Updating event with FormData');
            const res = await updateEvent(id, formData);
            console.log('Response data:', res.data);
            navigate("/admin/events");
        } catch (err) {
            console.error('Update error:', err);
            setError(err.response?.data?.message || "Failed to update event");
        }
    };

    if (loading) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="mt-6 border border-gray-200 shadow-xl rounded-2xl overflow-hidden bg-white p-8 max-w-4xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">Loading event data...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="mt-6 border border-gray-200 shadow-xl rounded-2xl overflow-hidden bg-white p-6 md:p-8 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-100">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Event</h1>
                        <p className="text-gray-500 mt-2">Update event information and ticket types</p>
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

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Event Details Section */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 bg-purple-600 rounded-full"></div>
                                Event Information
                            </div>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Event Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="EventName" className="block font-medium text-gray-700">
                                    Event Name
                                </label>
                                <input
                                    type="text"
                                    id="EventName"
                                    name="EventName"
                                    value={form.EventName}
                                    onChange={handleOnChange}
                                    placeholder="Enter event name"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="EventTypeId" className="block font-medium text-gray-700">
                                    Event Type
                                </label>
                                <div className="relative">
                                    <select
                                        id="EventTypeId"
                                        name="EventTypeId"
                                        value={form.EventTypeId}
                                        onChange={handleOnChange}
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

                            <div className="space-y-2">
                                <label htmlFor="VenueId" className="block font-medium text-gray-700">
                                    Venue
                                </label>
                                <div className="relative">
                                    <select
                                        id="VenueId"
                                        name="VenueId"
                                        value={form.VenueId}
                                        onChange={handleOnChange}
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

                            <div className="space-y-2">
                                <label htmlFor="OrganizerId" className="block font-medium text-gray-700">
                                    Organizer
                                </label>
                                <div className="relative">
                                    <select
                                        id="OrganizerId"
                                        name="OrganizerId"
                                        value={form.OrganizerId}
                                        onChange={handleOnChange}
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

                            <div className="space-y-2">
                                <label htmlFor="StartDate" className="block font-medium text-gray-700">
                                    Start Date
                                </label>
                                <input
                                    type="datetime-local"
                                    id="StartDate"
                                    name="StartDate"
                                    value={form.StartDate}
                                    onChange={handleOnChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="EndDate" className="block font-medium text-gray-700">
                                    End Date
                                </label>
                                <input
                                    type="datetime-local"
                                    id="EndDate"
                                    name="EndDate"
                                    value={form.EndDate}
                                    onChange={handleOnChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="EventStatus" className="block font-medium text-gray-700">
                                    Event Status
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

                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">
                                    Check this box to make the event active immediately
                                </p>
                                <div className="flex items-center ml-6">
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
                            </div>

                            <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                                <label className="block font-medium text-gray-700">
                                    Event Image
                                </label>

                                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <div className="w-64 h-48 rounded-xl border-4 border-purple-200 overflow-hidden shadow-md">
                                                <img
                                                    src={form.EventImage
                                                        ? URL.createObjectURL(form.EventImage)
                                                        : form.ExistingEventImage || '/default-event.jpg'
                                                    }
                                                    alt="Event preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <label
                                                htmlFor="EventImage"
                                                className="absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <input
                                                    type="file"
                                                    id="EventImage"
                                                    name="EventImage"
                                                    onChange={handleOnChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>

                                        <span className="text-sm text-gray-500">
                                            Click the camera icon to change image (JPG, PNG, WEBP, max 2MB)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                                        Ticket Types
                                    </div>
                                </h2>
                                <p className="text-gray-500 mt-2">Update ticket types for your event</p>
                            </div>
                            <button
                                type="button"
                                onClick={addTicketType}
                                className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-base font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Ticket Type
                            </button>
                        </div>

                        <div className="space-y-6">
                            {ticketTypes.map((ticket, index) => (
                                <div
                                    key={ticket.id}
                                    className={`border rounded-xl p-5 transition-all duration-200 ${
                                        ticket.isValid
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-gray-200 bg-white'
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                        <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                            <div className={`w-3 h-3 rounded-full ${
                                                ticket.isValid ? 'bg-green-500' : 'bg-gray-300'
                                            }`}></div>
                                            <h3 className="font-medium text-gray-900">
                                                Ticket Type {index + 1}
                                                {ticket.TicketTypeCode && (
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        (Code: {ticket.TicketTypeCode})
                                                    </span>
                                                )}
                                            </h3>
                                            {ticket.isValid && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Valid
                                                </span>
                                            )}
                                        </div>
                                        {ticketTypes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTicketType(ticket.id)}
                                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="block font-medium text-gray-700 text-sm">
                                                Ticket Type Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={ticket.TicketTypeName}
                                                onChange={(e) => handleTicketTypeChange(ticket.id, 'TicketTypeName', e.target.value)}
                                                placeholder="e.g., VIP, Regular, Student"
                                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block font-medium text-gray-700 text-sm">
                                                Price ($) <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={ticket.Price}
                                                    onChange={(e) => handleTicketTypeChange(ticket.id, 'Price', e.target.value)}
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    className="w-full border border-gray-300 p-2.5 pl-8 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block font-medium text-gray-700 text-sm">
                                                Total Quantity <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={ticket.TotalQuantity}
                                                onChange={(e) => handleTicketTypeChange(ticket.id, 'TotalQuantity', e.target.value)}
                                                min="0"
                                                placeholder="Number of tickets"
                                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {!ticket.isValid && ticket.TicketTypeName && (
                                        <p className="text-sm text-amber-600 mt-3">
                                            Please enter valid price and quantity to make this ticket type active
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-5">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <h4 className="font-medium text-gray-900">Ticket Summary</h4>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Total tickets available for this event
                                    </p>
                                </div>
                                <div className="mt-4 sm:mt-0 text-right">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {form.TotalTicketQuantity.toLocaleString()} tickets
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Across {ticketTypes.filter(t => t.isValid).length} valid ticket type(s)
                                    </div>
                                </div>
                            </div>
                            {ticketTypes.filter(t => t.isValid).length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Ticket Breakdown:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {ticketTypes.filter(t => t.isValid).map(ticket => (
                                            <div key={ticket.id} className="bg-white border border-gray-300 rounded-lg px-3 py-1.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <span className="font-medium text-gray-800">{ticket.TicketTypeName}</span>
                                                    <span className="text-gray-600">× {ticket.TotalQuantity}</span>
                                                    <span className="text-green-600 font-medium">${parseFloat(ticket.Price).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                        <Link
                            to="/admin/events"
                            className="px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={ticketTypes.filter(t => t.isValid).length === 0}
                            className={`px-8 py-3 rounded-xl text-base font-semibold transition-colors shadow-sm hover:shadow-md ${
                                ticketTypes.filter(t => t.isValid).length === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                        >
                            Update Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};