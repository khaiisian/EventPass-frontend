import React, { useEffect, useState } from 'react'
import {getTransactions} from "../../../api/transactionApi.js";
import { Link } from "react-router-dom";

export const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const fetchTransactions = async (page = 1) => {
        try {
            const response = await getTransactions({ page, per_page: 10 });
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
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
            fetchTransactions(page);
        }
    }

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

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }

    // Get status badge class
    const getStatusClass = (status) => {
        return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    }

    // Get status text
    const getStatusText = (status) => {
        return status ? 'Completed' : 'Pending';
    }

    if (loading) {
        return (
            <div className="px-4 md:px-6 lg:px-8 py-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading transactions...</div>
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
                    {/* You can add filters or export buttons here if needed */}
                    <button
                        onClick={() => fetchTransactions()}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
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
                        {transactions.map(transaction => (
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
                                    <div className="text-gray-900 text-sm">
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
                                    <div className="text-gray-700">
                                        {transaction.PaymentType || 'Not Specified'}
                                    </div>
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
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {transactions.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                        <p className="text-gray-500">Transactions will appear here once customers make purchases.</p>
                    </div>
                )}
            </div>

            {/* Pagination - Same as OrganizerList */}
            {pagination.last_page > 1 && (
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