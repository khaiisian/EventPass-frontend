import React, { useEffect, useState, useCallback } from 'react'
import { getUsers, deleteUser } from "../../../api/userService.js";
import { Link } from "react-router-dom";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true); // Full page loading
    const [tableLoading, setTableLoading] = useState(false); // Table-only loading
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    // State for filters and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [activeRole, setActiveRole] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Role options
    const roleOptions = [
        { id: 'all', name: 'All Roles' },
        { id: 'CUSTOMER', name: 'Customer' },
        { id: 'ADMIN', name: 'Admin' }
    ];

    // Sort options
    const sortOptions = [
        { id: 'newest', name: 'Newest First' },
        { id: 'oldest', name: 'Oldest First' },
        { id: 'name_asc', name: 'Name (A-Z)' },
        { id: 'name_desc', name: 'Name (Z-A)' }
    ];

    // Track if this is the first load
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    // Fetch users with filters
    const fetchUsers = useCallback(async (page = 1, isFilterChange = false) => {
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

            // Add role filter if not "all"
            if (activeRole !== 'all') {
                params.role = activeRole;
            }

            // Add search term if exists
            if (searchTerm.trim()) {
                params.search = searchTerm.trim();
            }

            // Add sort parameter
            if (sortBy === 'newest') {
                params.sort_by = 'created_desc';
            } else if (sortBy === 'oldest') {
                params.sort_by = 'created_asc';
            } else if (sortBy) {
                params.sort_by = sortBy;
            }

            const response = await getUsers(params);
            setUsers(response.data.data);
            setPagination(response.data.meta || {
                current_page: page,
                last_page: 1,
                per_page: 10,
                total: response.data.data.length
            });
        } catch (error) {
            console.log(error);
        } finally {
            if (isFirstLoad) {
                setInitialLoading(false);
                setIsFirstLoad(false);
            }
            setTableLoading(false);
        }
    }, [activeRole, searchTerm, sortBy, isFirstLoad]);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle filter changes with debounce
    useEffect(() => {
        if (!isFirstLoad) {
            const timer = setTimeout(() => {
                fetchUsers(1, true); // Reset to page 1 when filters change
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [activeRole, sortBy, isFirstLoad, searchTerm]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }
        try {
            await deleteUser(id);
            fetchUsers(pagination.current_page, true);
        } catch (error) {
            console.log(error);
        }
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
            fetchUsers(page, true);
        }
    }

    const handleRoleChange = (roleId) => {
        setActiveRole(roleId);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearFilters = () => {
        setActiveRole('all');
        setSearchTerm('');
        setSortBy('newest');
    };

    // Initial full page loading
    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600 mt-1">
                        Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                        {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                        of {pagination.total} users
                    </p>
                </div>
                <Link
                    to="/admin/users/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add User
                </Link>
            </div>

            {/* Filters Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Role Filters */}
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                            {roleOptions.map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => handleRoleChange(role.id)}
                                    className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                                        activeRole === role.id
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {role.name}
                                </button>
                            ))}
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
                                placeholder="Search by name or email..."
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
                {(activeRole !== 'all' || searchTerm || sortBy !== 'newest') && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {activeRole !== 'all' && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded flex items-center gap-1">
                                Role: {roleOptions.find(r => r.id === activeRole)?.name}
                                <button onClick={() => setActiveRole('all')} className="hover:text-purple-900">✕</button>
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
                            <p className="text-gray-600 text-sm">Loading users...</p>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-white">User Code</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Name</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Email</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Phone</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Role</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {!tableLoading && users.length > 0 ? (
                            users.map(user => (
                                <tr
                                    key={user.UserId}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    {/* User Code */}
                                    <td className="py-5 px-6">
                                        <div className="font-mono font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded text-sm inline-block">
                                            {user.UserCode}
                                        </div>
                                    </td>

                                    {/* Name */}
                                    <td className="py-5 px-6">
                                        <div className="font-medium text-gray-900">
                                            {user.UserName}
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="py-5 px-6">
                                        <div className="text-gray-700">
                                            {user.Email}
                                        </div>
                                    </td>

                                    {/* Phone Number */}
                                    <td className="py-5 px-6">
                                        <div className="text-gray-700">
                                            {user.PhNumber || '-'}
                                        </div>
                                    </td>

                                    {/* Role Badge */}
                                    <td className="py-5 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            user.Role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                                        }`}>
                                            {user.Role}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-5 px-6">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/users/${user.UserId}/edit`}
                                                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.UserId)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : !tableLoading && users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-12 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm || activeRole !== 'all'
                                            ? 'Try adjusting your search or filters'
                                            : 'Get started by adding your first user.'
                                        }
                                    </p>
                                    {(searchTerm || activeRole !== 'all') && (
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
                        of {pagination.total} users
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
}

export default UserList;