import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getVenues, deleteVenue } from "../../../api/venue.js";
import { getVenueTypes } from '../../../api/venueType.js';

export const VenueList = () => {
    const [venues, setVenues] = useState([]);
    const [venueTypes, setVenueTypes] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true); // Full page loading
    const [tableLoading, setTableLoading] = useState(false); // Table-only loading
    const [typesLoading, setTypesLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    // State for filters and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Sort options for admin
    const sortOptions = [
        { id: 'newest', name: 'Newest First' },
        { id: 'name_asc', name: 'Name (A-Z)' },
        { id: 'name_desc', name: 'Name (Z-A)' },
        { id: 'capacity_asc', name: 'Capacity (Low to High)' },
        { id: 'capacity_desc', name: 'Capacity (High to Low)' }
    ];

    // Track if this is the first load
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    // Fetch venues with filters
    const fetchVenues = useCallback(async (page = 1, isFilterChange = false) => {
        try {
            // Only show table loading for filter changes, not initial load
            if (isFilterChange || !isFirstLoad) {
                setTableLoading(true);
            }

            // Prepare query params
            const params = {
                page,
                per_page: 10
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
            setVenues(response.data.data);
            setPagination(response.data.meta || {
                current_page: page,
                last_page: 1,
                per_page: 10,
                total: response.data.data.length
            });
        } catch (error) {
            console.error(error);
        } finally {
            if (isFirstLoad) {
                setInitialLoading(false);
                setIsFirstLoad(false);
            }
            setTableLoading(false);
        }
    }, [activeFilter, searchTerm, sortBy, isFirstLoad]);

    // Fetch venue types
    const fetchVenueTypes = async () => {
        try {
            setTypesLoading(true);
            const response = await getVenueTypes();
            if (response.data.status === true) {
                const allVenuesOption = { VenueTypeId: 'all', VenueTypeName: 'All Types' };
                setVenueTypes([allVenuesOption, ...response.data.data]);
            }
        } catch (err) {
            console.error('Error fetching venue types:', err);
            const defaultTypes = [
                { VenueTypeId: 'all', VenueTypeName: 'All Types' }
            ];
            setVenueTypes(defaultTypes);
        } finally {
            setTypesLoading(false);
        }
    };

    useEffect(() => {
        fetchVenues();
        fetchVenueTypes();
    }, []);

    // Handle filter changes with debounce
    useEffect(() => {
        if (!isFirstLoad) {
            const timer = setTimeout(() => {
                fetchVenues(1, true); // Reset to page 1 when filters change
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [activeFilter, sortBy, isFirstLoad, searchTerm]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this venue?")) return;

        try {
            await deleteVenue(id);
            fetchVenues(pagination.current_page, true);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
            fetchVenues(page, true);
        }
    };

    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearFilters = () => {
        setActiveFilter('all');
        setSearchTerm('');
        setSortBy('newest');
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

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Venues</h1>
                    <p className="text-gray-600 mt-1">
                        Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                        {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                        of {pagination.total} venues
                    </p>
                </div>
                <Link
                    to="/admin/venues/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Venue
                </Link>
            </div>

            {/* Filters Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Venue Type Filters */}
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                            {typesLoading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 rounded-lg bg-gray-100 animate-pulse"
                                        style={{ width: '120px', height: '40px' }}
                                    ></div>
                                ))
                            ) : (
                                venueTypes.map(type => (
                                    <button
                                        key={type.VenueTypeId}
                                        onClick={() => handleFilterChange(type.VenueTypeId)}
                                        className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                                            activeFilter === type.VenueTypeId
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type.VenueTypeName}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Search and Sort */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search venues..."
                                className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                            />
                            <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={handleSortChange}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
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
                {(activeFilter !== 'all' || searchTerm || sortBy !== 'newest') && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {activeFilter !== 'all' && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded flex items-center gap-1">
                                Type: {venueTypes.find(t => t.VenueTypeId === activeFilter)?.VenueTypeName || 'Selected'}
                                <button onClick={() => setActiveFilter('all')} className="hover:text-purple-900">✕</button>
                            </span>
                        )}
                        {searchTerm && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded flex items-center gap-1">
                                Search: "{searchTerm}"
                                <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">✕</button>
                            </span>
                        )}
                        {sortBy !== 'newest' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
                                Sort: {sortOptions.find(s => s.id === sortBy)?.name}
                                <button onClick={() => setSortBy('newest')} className="hover:text-green-900">✕</button>
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

            {/* Table Container with Loading Overlay */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white relative">
                {/* Table Loading Overlay */}
                {tableLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                            <p className="text-gray-600 text-sm">Loading venues...</p>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-900 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-white">Venue Code</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Venue Name</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Type</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Capacity</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Address</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {!tableLoading && venues.length > 0 ? (
                            venues.map((venue) => (
                                <tr
                                    key={venue.VenueId}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    {/* Venue Code */}
                                    <td className="py-5 px-6">
                                        <div className="font-mono font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded text-sm inline-block">
                                            {venue.VenueCode}
                                        </div>
                                    </td>

                                    {/* Venue Name */}
                                    <td className="py-5 px-6">
                                        <div className="font-medium text-gray-900">
                                            {venue.VenueName}
                                        </div>
                                    </td>

                                    {/* Venue Type */}
                                    <td className="py-5 px-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                            {venue.venueType?.VenueTypeName || "-"}
                                        </span>
                                    </td>

                                    {/* Capacity */}
                                    <td className="py-5 px-6">
                                        <div className="text-gray-700 font-medium">
                                            {venue.Capacity ? venue.Capacity.toLocaleString() : "-"}
                                        </div>
                                    </td>

                                    {/* Address */}
                                    <td className="py-5 px-6 max-w-md">
                                        <div className="text-gray-700 text-sm">
                                            {venue.Address || "-"}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-5 px-6">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/venues/${venue.VenueId}/edit`}
                                                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(venue.VenueId)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : !tableLoading && venues.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-12 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                  d="M3 7h18M3 12h18M3 17h18" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No venues found
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm || activeFilter !== 'all'
                                            ? 'Try adjusting your search or filters'
                                            : 'Get started by adding your first venue.'
                                        }
                                    </p>
                                    {(searchTerm || activeFilter !== 'all') && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ) : null}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {!tableLoading && pagination.last_page > 1 && (
                <div className="flex justify-between items-center mt-6 px-4 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                        {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                        of {pagination.total} venues
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
};

export default VenueList;