import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../../api/event.js';
import { getEventTypes } from '../../../api/eventType.js';

export const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true); // Full page loading
    const [eventsLoading, setEventsLoading] = useState(false); // Only events grid loading
    const [typesLoading, setTypesLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 9,
        total: 0
    });

    // State for filters and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date_desc');

    // Updated sort options to match backend
    const sortOptions = [
        { id: 'date_desc', name: 'Newest' },
        { id: 'date_asc', name: 'Oldest' },
        { id: 'name_asc', name: 'Name (A-Z)' },
        { id: 'name_desc', name: 'Name (Z-A)' },
        { id: 'popular', name: 'Most Popular' }
    ];

    // Track if this is the first load
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    // Fetch events with filters
    const fetchEvents = useCallback(async (page = 1, isFilterChange = false) => {
        try {
            // Only show events loading for filter changes, not initial load
            if (isFilterChange || !isFirstLoad) {
                setEventsLoading(true);
            }

            // Prepare query params
            const params = {
                page,
                per_page: 9
            };

            // Add event type filter if not "all"
            if (activeFilter !== 'all') {
                params.event_type_id = activeFilter;
            }

            // Add search term if exists
            if (searchTerm.trim()) {
                params.search = searchTerm.trim();
                console.log("Search => "+params.search);
            }

            // Add sort parameter
            if (sortBy) {
                params.sort_by = sortBy;
            }

            const response = await getEvents(params);
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
            if (isFirstLoad) {
                setInitialLoading(false);
                setIsFirstLoad(false);
            }
            setEventsLoading(false);
        }
    }, [activeFilter, searchTerm, sortBy, isFirstLoad]);

    // Fetch event types
    const fetchEventTypes = async () => {
        try {
            setTypesLoading(true);
            const response = await getEventTypes();
            if (response.data.status === true) {
                const allEventsOption = { EventTypeId: 'all', EventTypeName: 'All Events' };
                setEventTypes([allEventsOption, ...response.data.data]);
            }
        } catch (err) {
            console.error('Error fetching event types:', err);
            const defaultTypes = [
                { EventTypeId: 'all', EventTypeName: 'All Events' }
            ];
            setEventTypes(defaultTypes);
        } finally {
            setTypesLoading(false);
        }
    };

    // Handle filter change
    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
    };

    // Handle sort change
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    // Handle search change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
            fetchEvents(page, true);
        }
    };

    // Fetch data when filters change
    useEffect(() => {
        if (!isFirstLoad) {
            // Reset to page 1 when filters change
            const timer = setTimeout(() => {
                fetchEvents(1, true);
            }, 300); // Debounce delay

            return () => clearTimeout(timer);
        }
    }, [activeFilter, sortBy, isFirstLoad, searchTerm]);

    // Initial data fetch
    useEffect(() => {
        fetchEvents();
        fetchEventTypes();
    }, []);

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
        return '🎫';
    };

    const getCategoryColor = () => {
        return 'bg-purple-100 text-purple-700';
    };

    const getEventImage = (event) => {
        if (event.EventImage) {
            return event.EventImage;
        }
        return 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80';
    };

    // Clear all filters
    const clearFilters = () => {
        setActiveFilter('all');
        setSearchTerm('');
        setSortBy('date_desc');
    };

    // Initial full page loading
    if (initialLoading) {
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
                        onClick={() => fetchEvents(1, true)}
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

            {/* Filters and Controls */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {typesLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 rounded-lg bg-gray-100 animate-pulse"
                                        style={{ width: '80px', height: '40px' }}
                                    ></div>
                                ))
                            ) : (
                                eventTypes.map(type => (
                                    <button
                                        key={type.EventTypeId}
                                        onClick={() => handleFilterChange(type.EventTypeId)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${
                                            activeFilter === type.EventTypeId
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type.EventTypeName}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Search and Sort Container */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                            {/* Search Bar */}
                            <div className="flex-1 md:flex-none md:w-80">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        placeholder="Search events..."
                                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                    />
                                    <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-sm md:text-base">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={handleSortChange}
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

                    {/* Active filters info */}
                    {(activeFilter !== 'all' || searchTerm || sortBy !== 'date_desc') && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-600">Active filters:</span>
                            {activeFilter !== 'all' && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded flex items-center gap-1">
                                    Type: {eventTypes.find(t => t.EventTypeId === activeFilter)?.EventTypeName || 'Selected'}
                                    <button onClick={() => setActiveFilter('all')} className="hover:text-purple-900">✕</button>
                                </span>
                            )}
                            {searchTerm && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded flex items-center gap-1">
                                    Search: "{searchTerm}"
                                    <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">✕</button>
                                </span>
                            )}
                            {sortBy !== 'date_desc' && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
                                    Sort: {sortOptions.find(s => s.id === sortBy)?.name}
                                    <button onClick={() => setSortBy('date_desc')} className="hover:text-green-900">✕</button>
                                </span>
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-600 hover:text-gray-900 ml-2"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Events Grid */}
            <div className="container mx-auto px-6 py-8">
                {/* Results Info */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {activeFilter === 'all' ? 'All' : eventTypes.find(t => t.EventTypeId === activeFilter)?.EventTypeName} Events
                            {searchTerm && ` matching "${searchTerm}"`}
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

                {/* Events Grid with Loading Overlay */}
                <div className="relative">
                    {/* Events Loading Overlay */}
                    {eventsLoading && (
                        <div className="absolute inset-0 bg-gray-50 bg-opacity-80 flex items-center justify-center z-10 rounded-2xl">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                                <p className="text-gray-600 text-sm">Loading events...</p>
                            </div>
                        </div>
                    )}

                    {!eventsLoading && events.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-gray-400 text-6xl mb-4">🎭</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm || activeFilter !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Check back later for new events.'
                                }
                            </p>
                            {(searchTerm || activeFilter !== 'all') && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {events.map(event => {
                                    const availableTickets = getAvailableTickets(event);
                                    const isAlmostSoldOut = availableTickets > 0 && availableTickets < 100;
                                    const isSoldOut = availableTickets <= 0;

                                    return (
                                        <div key={event.EventId} className="group">
                                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                                {/* Event Image - Clickable */}
                                                <Link to={`/events/${event.EventId}/details`}>
                                                    <div className="relative h-56 overflow-hidden">
                                                        <img
                                                            src={getEventImage(event)}
                                                            alt={event.EventName}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />

                                                        {/* Category Badge */}
                                                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor()}`}>
                                                            {getCategoryIcon()} {event.EventType?.EventTypeName || 'Event'}
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
                                                </Link>

                                                {/* Event Details */}
                                                <div className="p-6">
                                                    {/* Event Name - Clickable */}
                                                    <Link to={`/events/${event.EventId}/details`} className="block mb-3">
                                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                                                            {event.EventName}
                                                        </h3>
                                                    </Link>

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

                                                        {/* View Button - Only clickable if not sold out */}
                                                        <Link
                                                            to={isSoldOut ? '#' : `/events/${event.EventId}/details`}
                                                            className={`inline-block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                                isSoldOut
                                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
                                                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                                            }`}
                                                        >
                                                            {isSoldOut ? 'Sold Out' : 'View Details'}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination Controls */}
                            {!eventsLoading && pagination.last_page > 1 && (
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
        </div>
    );
};