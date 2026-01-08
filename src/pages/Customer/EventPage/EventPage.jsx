import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../../api/event.js';

export const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 9,
        total: 0
    });

    // UI-only states (no functionality)
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    const filters = [
        { id: 'all', name: 'All Events' },
        { id: 'music', name: 'Music' },
        { id: 'sports', name: 'Sports' },
        { id: 'conference', name: 'Conferences' },
        { id: 'festival', name: 'Festivals' },
        { id: 'workshop', name: 'Workshops' }
    ];

    const sortOptions = [
        { id: 'date', name: 'Date' },
        { id: 'popular', name: 'Most Popular' },
        { id: 'name', name: 'Name' }
    ];

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async (page = 1) => {
        try {
            setLoading(true);
            const response = await getEvents({ page, per_page: 9 });
            if (response.data.status === true) {
                setEvents(response.data.data);
                setPagination(response.data.meta || {
                    current_page: page,
                    last_page: 1,
                    per_page: 9,
                    total: response.data.data.length
                });
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    // Pagination handlers
    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
            fetchEvents(page);
        }
    };

    // Helper functions
    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'Time TBD';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAvailableTickets = (event) => {
        const total = event.TotalTicketQuantity || 0;
        const sold = event.SoldOutTicketQuantity || 0;
        return total - sold;
    };

    // Same icon for all event types
    const getCategoryIcon = () => {
        return '🎫'; // Same ticket icon for all events
    };

    // Same background color for all event types
    const getCategoryColor = () => {
        return 'bg-purple-100 text-purple-700'; // Same purple color for all events
    };

    // Get fallback image if EventImage is null
    const getEventImage = (event) => {
        if (event.EventImage) {
            return event.EventImage;
        }
        // Fallback image for all events
        return 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchEvents(1)}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero/Header Section */}
            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <div className="container mx-auto px-6 py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Discover Amazing Events
                        </h1>
                        <p className="text-xl text-purple-100 mb-8">
                            Find and book tickets for concerts, sports, conferences, and more in your area
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters and Controls (UI Only - No Functionality) */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        {/* Category Filters (UI Only) */}
                        <div className="flex flex-wrap gap-2">
                            {filters.map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        activeFilter === filter.id
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {filter.name}
                                </button>
                            ))}
                        </div>

                        {/* Search and Sort Container (UI Only) */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                            {/* Search Bar (UI Only) */}
                            <div className="flex-1 md:flex-none md:w-80">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search events..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                />
                            </div>

                            {/* Sort Dropdown (UI Only) */}
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-sm md:text-base">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm md:text-base"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="container mx-auto px-6 py-8">
                {/* Results Info */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Upcoming Events
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                            {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                            of {pagination.total} {pagination.total === 1 ? 'event' : 'events'}
                        </p>
                    </div>
                    <div className="text-sm text-gray-600">
                        Page {pagination.current_page} of {pagination.last_page}
                    </div>
                </div>

                {/* Events Grid */}
                {events.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-4">🎭</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-600">
                            Check back later for new events.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map(event => {
                                const availableTickets = getAvailableTickets(event);
                                const isAlmostSoldOut = availableTickets > 0 && availableTickets < 100;
                                const isSoldOut = availableTickets <= 0;

                                return (
                                    <Link
                                        key={event.EventId}
                                        to={`/events/${event.EventId}`}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                            {/* Event Image */}
                                            <div className="relative h-56 overflow-hidden">
                                                <img
                                                    src={getEventImage(event)}
                                                    alt={event.EventName}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />

                                                {/* Category Badge (Same for all events) */}
                                                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor()}`}>
                                                    {getCategoryIcon()} {event.EventType?.EventTypeName}
                                                </div>

                                                {/* Sold Out Badge */}
                                                {isSoldOut && (
                                                    <div className="absolute top-3 right-3 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                                                        Sold Out!
                                                    </div>
                                                )}

                                                {/* Almost Sold Out Badge */}
                                                {isAlmostSoldOut && (
                                                    <div className="absolute top-3 right-3 px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">
                                                        Almost Sold Out!
                                                    </div>
                                                )}
                                            </div>

                                            {/* Event Details */}
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                                                        {event.EventName}
                                                    </h3>
                                                </div>

                                                {/* Date and Time */}
                                                <div className="flex items-center gap-3 text-gray-600 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{formatDate(event.StartDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{formatTime(event.StartDate)}</span>
                                                    </div>
                                                </div>

                                                {/* Venue */}
                                                <div className="flex items-center gap-2 text-gray-600 mb-4">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="text-sm">{event.Venue?.VenueName}</span>
                                                </div>

                                                {/* Ticket Availability */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div>
                                                        <div className={`text-sm font-medium ${
                                                            isSoldOut ? 'text-red-600' :
                                                                isAlmostSoldOut ? 'text-orange-600' :
                                                                    'text-gray-900'
                                                        }`}>
                                                            {isSoldOut
                                                                ? 'Sold Out'
                                                                : `${availableTickets.toLocaleString()} tickets available`
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Total: {event.TotalTicketQuantity?.toLocaleString() || '0'} tickets
                                                        </div>
                                                    </div>

                                                    {/* View Button */}
                                                    <button
                                                        disabled={isSoldOut}
                                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                            isSoldOut
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                : 'bg-purple-600 text-white hover:bg-purple-700'
                                                        }`}
                                                    >
                                                        {isSoldOut ? 'Sold Out' : 'View Details'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {pagination.last_page > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                        pagination.current_page === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </button>

                                <div className="flex gap-1">
                                    {[...Array(pagination.last_page)].map((_, index) => {
                                        const pageNum = index + 1;
                                        // Show first, last, current, and pages around current
                                        if (
                                            pageNum === 1 ||
                                            pageNum === pagination.last_page ||
                                            (pageNum >= pagination.current_page - 1 && pageNum <= pagination.current_page + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10 rounded-lg ${
                                                        pagination.current_page === pageNum
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                        // Show ellipsis
                                        if (
                                            pageNum === 2 && pagination.current_page > 3 ||
                                            pageNum === pagination.last_page - 1 && pagination.current_page < pagination.last_page - 2
                                        ) {
                                            return <span key={pageNum} className="w-10 h-10 flex items-center justify-center">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                        pagination.current_page === pagination.last_page
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Next
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};