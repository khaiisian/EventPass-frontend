import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTopEvents } from '../../../api/event.js';
import { getTopVenues } from '../../../api/venue.js';

export const HomePage = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [featuredVenues, setFeaturedVenues] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [venuesLoading, setVenuesLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTopEvents();
        fetchTopVenues();
    }, []);

    const fetchTopEvents = async () => {
        try {
            setEventsLoading(true);
            const response = await getTopEvents();
            if (response.data.status === true) {
                setFeaturedEvents(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching top events:', err);
            setError('Failed to load events');
        } finally {
            setEventsLoading(false);
        }
    };

    const fetchTopVenues = async () => {
        try {
            setVenuesLoading(true);
            const response = await getTopVenues();
            if (response.data.status === true) {
                setFeaturedVenues(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching top venues:', err);
        } finally {
            setVenuesLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getAvailableTickets = (event) => {
        const total = event.TotalTicketQuantity || 0;
        const sold = event.SoldOutTicketQuantity || 0;
        return total - sold;
    };

    const formatCapacity = (capacity) => {
        return capacity ? capacity.toLocaleString() : 'N/A';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container mx-auto px-6 py-20 md:py-28 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-8">
                            <h1 className="text-5xl md:text-7xl font-bold mb-6">
                                Discover
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 mt-2">
                                    Unforgettable Events
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
                                Find, book, and experience the best concerts, conferences, sports, and festivals in one place.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8 mb-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-1">500+</div>
                                <div className="text-purple-200 text-sm">Events Monthly</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-1">50k+</div>
                                <div className="text-purple-200 text-sm">Tickets Sold</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-1">100+</div>
                                <div className="text-purple-200 text-sm">Venues</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-1">4.8</div>
                                <div className="text-purple-200 text-sm">User Rating</div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/events"
                                className="px-8 py-4 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg"
                            >
                                Explore All Events
                            </Link>
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all transform hover:scale-105"
                            >
                                Create Free Account
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                        <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,192C672,181,768,139,864,138.7C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            {/* Featured Events Section */}
            <div className="container mx-auto px-6 py-16">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
                        <p className="text-gray-600 mt-2">Discover our top upcoming events</p>
                    </div>
                    <Link
                        to="/events"
                        className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                    >
                        View All →
                    </Link>
                </div>

                {eventsLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchTopEvents}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : featuredEvents.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No events available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredEvents.map(event => {
                            const availableTickets = getAvailableTickets(event);
                            const isAlmostSoldOut = availableTickets < 100;

                            return (
                                <div key={event.EventId} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={event.EventImage}
                                            alt={event.EventName}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                        {isAlmostSoldOut && (
                                            <div className="absolute top-3 right-3 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                                                Almost Sold Out!
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                                {event.EventType?.EventTypeName || 'Event'}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                {formatDate(event.StartDate)}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                            {event.EventName}
                                        </h3>
                                        <div className="space-y-2 mb-4">
                                            <p className="text-gray-600 flex items-center gap-2 text-sm">
                                                📍 {event.Venue?.VenueName || event.Venue?.Address || 'Venue TBD'}
                                            </p>
                                            <p className="text-gray-600 flex items-center gap-2 text-sm">
                                                👤 {event.Organizer?.OrganizerName || 'Organizer'}
                                            </p>
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Tickets Available: {availableTickets.toLocaleString()}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Total: {event.TotalTicketQuantity?.toLocaleString() || '0'}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/events/${event.EventId}/details`}
                                            className="block w-full py-3 bg-gray-900 text-white font-medium text-center rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Popular Venues Section */}
            <div className="container mx-auto px-6 py-16">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Popular Venues</h2>
                        <p className="text-gray-600 mt-2">Experience events at iconic locations</p>
                    </div>
                    <Link
                        to="/venues"
                        className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                    >
                        View All Venues →
                    </Link>
                </div>

                {venuesLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                    </div>
                ) : featuredVenues.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No venues available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredVenues.map(venue => (
                            <div key={venue.VenueId} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={venue.VenueImage}
                                        alt={venue.VenueName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 px-3 py-1 bg-black/80 text-white text-xs font-bold rounded-full">
                                        {venue.venueType?.VenueTypeName || 'Venue'}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                        <h3 className="text-2xl font-bold text-white mb-2">{venue.VenueName}</h3>
                                        <p className="text-white/90">{venue.Address}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {venue.Description && (
                                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                                            {venue.Description}
                                        </p>
                                    )}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600 mb-1">Capacity</div>
                                            <div className="text-xl font-bold text-gray-900">{formatCapacity(venue.Capacity)}</div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600 mb-1">Type</div>
                                            <div className="text-xl font-bold text-gray-900">
                                                {venue.venueType?.VenueTypeName || 'Venue'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm">{venue.VenueCode}</span>
                                        </div>
                                        <Link
                                            to={`/venues/${venue.VenueId}/details`}
                                            className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* How It Works Section */}
            <div className="container mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
                    How EventPass Works
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-100 text-gray-700 rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                            1
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Find Events</h3>
                        <p className="text-gray-600">
                            Browse thousands of events by category, location, or date
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-100 text-gray-700 rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                            2
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Book Tickets</h3>
                        <p className="text-gray-600">
                            Select your seats and purchase tickets securely online
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-100 text-gray-700 rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                            3
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Enjoy Event</h3>
                        <p className="text-gray-600">
                            Receive digital passes and get ready for an amazing experience
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};