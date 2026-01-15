import React, { useEffect, useState, useCallback } from 'react'
import {getTransactions} from "../../../api/transactionApi.js";
import { Link } from "react-router-dom";

export const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
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
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Filter options
    const statusOptions = [
        { id: 'all', name: 'All Statuses' },
        { id: 'true', name: 'Completed' },
        { id: 'false', name: 'Pending' }
    ];

    const paymentTypeOptions = [
        { id: 'all', name: 'All Payment Types' },
        { id: 'CreditCard', name: 'Credit Card' },
        { id: 'PayPal', name: 'PayPal' },
        { id: 'BankTransfer', name: 'Bank Transfer' }
    ];

    // Sort options
    const sortOptions = [
        { id: 'newest', name: 'Newest First' },
        { id: 'oldest', name: 'Oldest First' },
        { id: 'date_desc', name: 'Date (Newest)' },
        { id: 'date_asc', name: 'Date (Oldest)' },
        { id: 'amount_desc', name: 'Amount (High to Low)' },
        { id: 'amount_asc', name: 'Amount (Low to High)' }
    ];

    // Track if this is the first load
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    // Fetch transactions with filters
    const fetchTransactions = useCallback(async (page = 1, isFilterChange = false) => {
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

            // Add status filter if not "all"
            if (statusFilter !== 'all') {
                params.status = statusFilter === 'true';
            }

            // Add payment type filter if not "all"
            if (paymentTypeFilter !== 'all') {
                params.payment_type = paymentTypeFilter;
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

            const response = await getTransactions(params);
            setTransactions(response.data.data);
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
    }, [statusFilter, paymentTypeFilter, searchTerm, sortBy, isFirstLoad]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Handle filter changes with debounce
    useEffect(() => {
        if (!isFirstLoad) {
            const timer = setTimeout(() => {
                fetchTransactions(1, true); // Reset to page 1 when filters change
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [statusFilter, paymentTypeFilter, sortBy, isFirstLoad, searchTerm]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
            fetchTransactions(page, true);
        }
    }

    const handleStatusChange = (statusId) => {
        setStatusFilter(statusId);
    };

    const handlePaymentTypeChange = (typeId) => {
        setPaymentTypeFilter(typeId);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearFilters = () => {
        setStatusFilter('all');
        setPaymentTypeFilter('all');
        setSearchTerm('');
        setSortBy('newest');
    };

    // Format date to readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const formatCurrency = (amount) => {
        return `${amount} Ks`;
    };

    // Get status badge class
    const getStatusClass = (status) => {
        return status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    }

    // Get status text
    const getStatusText = (status) => {
        return status ? 'Completed' : 'Pending';
    }

    // Get payment type badge class
    const getPaymentTypeClass = (type) => {
        switch(type?.toUpperCase()) {
            case 'CREDIT_CARD':
                return 'bg-blue-100 text-blue-800';
            case 'DEBIT_CARD':
                return 'bg-purple-100 text-purple-800';
            case 'PAYPAL':
                return 'bg-indigo-100 text-indigo-800';
            case 'BANK_TRANSFER':
                return 'bg-teal-100 text-teal-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    // Initial full page loading
    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading transactions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-600 mt-1">
                        Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                        {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                        of {pagination.total} transactions
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => fetchTransactions(1, true)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div className="space-y-4">
                    {/* Status and Payment Type Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map(status => (
                                    <button
                                        key={status.id}
                                        onClick={() => handleStatusChange(status.id)}
                                        className={`px-3 py-1.5 rounded-lg transition-colors text-sm ${
                                            statusFilter === status.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {status.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                            <div className="flex flex-wrap gap-2">
                                {paymentTypeOptions.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => handlePaymentTypeChange(type.id)}
                                        className={`px-3 py-1.5 rounded-lg transition-colors text-sm ${
                                            paymentTypeFilter === type.id
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Search and Sort */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search by transaction code or email..."
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
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
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                            <div className="flex items-center gap-2">
                                <select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
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

                {/* Active filters info */}
                {(statusFilter !== 'all' || paymentTypeFilter !== 'all' || searchTerm || sortBy !== 'newest') && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {statusFilter !== 'all' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded flex items-center gap-1">
                                Status: {statusOptions.find(s => s.id === statusFilter)?.name}
                                <button onClick={() => setStatusFilter('all')} className="hover:text-blue-900">✕</button>
                            </span>
                        )}
                        {paymentTypeFilter !== 'all' && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded flex items-center gap-1">
                                Payment: {paymentTypeOptions.find(p => p.id === paymentTypeFilter)?.name}
                                <button onClick={() => setPaymentTypeFilter('all')} className="hover:text-purple-900">✕</button>
                            </span>
                        )}
                        {searchTerm && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
                                Search: "{searchTerm}"
                                <button onClick={() => setSearchTerm('')} className="hover:text-green-900">✕</button>
                            </span>
                        )}
                        {sortBy !== 'newest' && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded flex items-center gap-1">
                                Sort: {sortOptions.find(s => s.id === sortBy)?.name}
                                <button onClick={() => setSortBy('newest')} className="hover:text-yellow-900">✕</button>
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
                            <p className="text-gray-600 text-sm">Loading transactions...</p>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-white">Transaction Code</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Customer</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Amount</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Status</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Payment Type</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Date</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {!tableLoading && transactions.length > 0 ? (
                            transactions.map(transaction => (
                                <tr
                                    key={transaction.TransactionId}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    {/* Transaction Code */}
                                    <td className="py-5 px-6">
                                        <div className="font-mono font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded text-sm inline-block">
                                            {transaction.TransactionCode}
                                        </div>
                                    </td>

                                    {/* Customer Info */}
                                    <td className="py-5 px-6">
                                        <div className="text-gray-500 text-sm">
                                            {transaction.Email}
                                        </div>
                                    </td>

                                    {/* Amount */}
                                    <td className="py-5 px-6">
                                        <div className="text-gray-900 font-medium">
                                            {formatCurrency(transaction.TotalAmount)}
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="py-5 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(transaction.Status)}`}>
                                            {getStatusText(transaction.Status)}
                                        </span>
                                    </td>

                                    {/* Payment Type */}
                                    <td className="py-5 px-6">
                                        {transaction.PaymentType ? (
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentTypeClass(transaction.PaymentType)}`}>
                                                {transaction.PaymentType}
                                            </span>
                                        ) : (
                                            <span className="text-gray-500 text-sm">Not Specified</span>
                                        )}
                                    </td>

                                    {/* Date */}
                                    <td className="py-5 px-6">
                                        <div className="text-gray-700 text-sm">
                                            {formatDate(transaction.TransactionDate)}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-5 px-6">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/transactions/${transaction.TransactionId}`}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : !tableLoading && transactions.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-12 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm || statusFilter !== 'all' || paymentTypeFilter !== 'all'
                                            ? 'Try adjusting your search or filters'
                                            : 'Transactions will appear here once customers make purchases.'
                                        }
                                    </p>
                                    {(searchTerm || statusFilter !== 'all' || paymentTypeFilter !== 'all') && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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
                        of {pagination.total} transactions
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
                                                    ? 'bg-blue-600 text-white'
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