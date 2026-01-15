import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getVenues } from '../../../api/venue.js';
import { getVenueTypes } from '../../../api/venueType.js';

export const VenuePage = () => {
    const [venues, setVenues] = useState([]);
    const [venueTypes, setVenueTypes] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true); // Full page loading
    const [venuesLoading, setVenuesLoading] = useState(false); // Only venues grid loading
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
    const [sortBy, setSortBy] = useState('name_asc');

    // Updated sort options to match backend
    const sortOptions = [
        { id: 'name_asc', name: 'Name (A-Z)' },
        { id: 'name_desc', name: 'Name (Z-A)' },
        { id: 'capacity_asc', name: 'Capacity (Low to High)' },
        { id: 'capacity_desc', name: 'Capacity (High to Low)' },
        { id: 'newest', name: 'Newest First' }
    ];

    // Track if this is the first load
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    // Fetch venues with filters
    const fetchVenues = useCallback(async (page = 1, isFilterChange = false) => {
        try {
            // Only show venues loading for filter changes, not initial load
            if (isFilterChange || !isFirstLoad) {
                setVenuesLoading(true);
            }

            // Prepare query params
            const params = {
                page,
                per_page: 9
            };

            // Add venue type filter if not "all"
            if (activeFilter !== 'all') {
                params.venue_type_id = activeFilter;
            }

            // Add search term if exists
            if (searchTerm.trim()) {
                params.search = searchTerm.trim();
            }

            // Add sort parameter
            if (sortBy === 'newest') {
                params.sort_by = ''; // Will use default (CreatedAt desc)
            } else if (sortBy) {
                params.sort_by = sortBy;
            }

            const response = await getVenues(params);
            if (response.data.status === true) {
                setVenues(response.data.data);
                setPagination(response.data.meta || {
                    current_page: page,
                    last_page: 1,
                    per_page: 9,
                    total: response.data.data.length
                });
            }
        } catch (err) {
            console.error('Error fetching venues:', err);
            setError('Failed to load venues');
        } finally {
            if (isFirstLoad) {
                setInitialLoading(false);
                setIsFirstLoad(false);
            }
            setVenuesLoading(false);
        }
    }, [activeFilter, searchTerm, sortBy, isFirstLoad]);

    // Fetch venue types
    const fetchVenueTypes = async () => {
        try {
            setTypesLoading(true);
            const response = await getVenueTypes();
            if (response.data.status === true) {
                const allVenuesOption = { VenueTypeId: 'all', VenueTypeName: 'All Venues' };
                setVenueTypes([allVenuesOption, ...response.data.data]);
            }
        } catch (err) {
            console.error('Error fetching venue types:', err);
            const defaultTypes = [
                { VenueTypeId: 'all', VenueTypeName: 'All Venues' }
            ];
            setVenueTypes(defaultTypes);
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
            fetchVenues(page, true);
        }
    };

    // Fetch data when filters change
    useEffect(() => {
        if (!isFirstLoad) {
            // Reset to page 1 when filters change
            const timer = setTimeout(() => {
                fetchVenues(1, true);
            }, 300); // Debounce delay

            return () => clearTimeout(timer);
        }
    }, [activeFilter, sortBy, isFirstLoad, searchTerm]);

    // Initial data fetch
    useEffect(() => {
        fetchVenues();
        fetchVenueTypes();
    }, []);

    // Helper functions
    const formatCapacity = (capacity) => {
        if (!capacity) return '0';
        if (capacity >= 1000) {
            return `${(capacity / 1000).toFixed(1)}k`;
        }
        return capacity.toLocaleString();
    };

    // Get fallback image if VenueImage is null
    const getVenueImage = (venue) => {
        if (venue.VenueImage) {
            return venue.VenueImage;
        }
        return 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=600&q=80';
    };

    // Clear all filters
    const clearFilters = () => {
        setActiveFilter('all');
        setSearchTerm('');
        setSortBy('name_asc');
    };

    // Initial full page loading
    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading venues...</p>
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
                        onClick={() => fetchVenues(1, true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="container mx-auto px-6 py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Discover Amazing Venues
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Find the perfect location for your next event, concert, or gathering
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
                                        style={{ width: '100px', height: '40px' }}
                                    ></div>
                                ))
                            ) : (
                                venueTypes.map(type => (
                                    <button
                                        key={type.VenueTypeId}
                                        onClick={() => handleFilterChange(type.VenueTypeId)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${
                                            activeFilter === type.VenueTypeId
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type.VenueTypeName}
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
                                        placeholder="Search venues..."
                                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm md:text-base"
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
                    {(activeFilter !== 'all' || searchTerm || sortBy !== 'name_asc') && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-600">Active filters:</span>
                            {activeFilter !== 'all' && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded flex items-center gap-1">
                                    Type: {venueTypes.find(t => t.VenueTypeId === activeFilter)?.VenueTypeName || 'Selected'}
                                    <button onClick={() => setActiveFilter('all')} className="hover:text-blue-900">✕</button>
                                </span>
                            )}
                            {searchTerm && (
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded flex items-center gap-1">
                                    Search: "{searchTerm}"
                                    <button onClick={() => setSearchTerm('')} className="hover:text-indigo-900">✕</button>
                                </span>
                            )}
                            {sortBy !== 'name_asc' && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
                                    Sort: {sortOptions.find(s => s.id === sortBy)?.name}
                                    <button onClick={() => setSortBy('name_asc')} className="hover:text-green-900">✕</button>
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

            {/* Venues Grid */}
            <div className="container mx-auto px-6 py-8">
                {/* Results Info */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {activeFilter === 'all' ? 'All' : venueTypes.find(t => t.VenueTypeId === activeFilter)?.VenueTypeName} Venues
                            {searchTerm && ` matching "${searchTerm}"`}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                            {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                            of {pagination.total} {pagination.total === 1 ? 'venue' : 'venues'}
                        </p>
                    </div>
                    <div className="text-sm text-gray-600">
                        Page {pagination.current_page} of {pagination.last_page}
                    </div>
                </div>

                {/* Venues Grid with Loading Overlay */}
                <div className="relative">
                    {/* Venues Loading Overlay */}
                    {venuesLoading && (
                        <div className="absolute inset-0 bg-gray-50 bg-opacity-80 flex items-center justify-center z-10 rounded-2xl">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                                <p className="text-gray-600 text-sm">Loading venues...</p>
                            </div>
                        </div>
                    )}

                    {!venuesLoading && venues.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-gray-400 text-6xl mb-4">🏟️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm || activeFilter !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Check back later for new venues.'
                                }
                            </p>
                            {(searchTerm || activeFilter !== 'all') && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {venues.map(venue => {
                                    const venueType = venue.venueType?.VenueTypeName || 'Unknown';

                                    return (
                                        <div key={venue.VenueId} className="group">
                                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                                                {/* Venue Image */}
                                                <div className="relative h-56 overflow-hidden">
                                                    <img
                                                        src={getVenueImage(venue)}
                                                        alt={venue.VenueName}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />

                                                    {/* Venue Type Badge */}
                                                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                                        {venueType}
                                                    </div>

                                                    {/* Capacity Badge */}
                                                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 text-white text-xs font-bold rounded-full">
                                                        {formatCapacity(venue.Capacity)} capacity
                                                    </div>
                                                </div>

                                                {/* Venue Details */}
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {venue.VenueName}
                                                        </h3>
                                                        <div className="flex items-center gap-1 text-gray-600">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-xs">{venue.Address?.split(',').slice(-2).join(',').trim()}</span>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    {venue.Description && (
                                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                            {venue.Description}
                                                        </p>
                                                    )}

                                                    {/* Full Address */}
                                                    <div className="flex items-start gap-2 text-gray-600 mb-4">
                                                        <svg className="w-4 h-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="text-sm">{venue.Address}</span>
                                                    </div>

                                                    {/* Venue Code and Capacity */}
                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {venue.VenueCode}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                Venue Code
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="text-lg font-bold text-gray-900">
                                                                {venue.Capacity?.toLocaleString()}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                Capacity
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* View Details Button */}
                                                    <div className="border-t border-gray-100 pt-4">
                                                        <Link
                                                            to={`/venues/${venue.VenueId}/details`}
                                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination Controls */}
                            {!venuesLoading && pagination.last_page > 1 && (
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
                                                                ? 'bg-blue-600 text-white'
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