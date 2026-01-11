import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTicketHistory } from '../../../api/transactionApi.js';

export const TicketHistoryPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTransactionHistory();
    }, []);

    const fetchTransactionHistory = async () => {
        try {
            setLoading(true);
            const response = await getTicketHistory();
            if (response.data.status === 'success' || response.data.status === true) {
                setTransactions(response.data.data || []);
            } else {
                setError('Failed to load transaction history');
            }
        } catch (err) {
            console.error('Error fetching transaction history:', err);
            setError('Failed to load transaction history');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        if (!price) return '$0.00';
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const getStatusText = (status) => {
        return status ? 'Completed' : 'Pending';
    };

    const getStatusClass = (status) => {
        return status
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading transaction history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load transactions</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchTransactionHistory}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-8">
                    <div className="mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
                        <p className="text-gray-600 mt-2">
                            View your recent ticket purchases
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Total Transactions</div>
                            <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                            <div className="text-2xl font-bold text-gray-900">
                                ${transactions.reduce((sum, t) => sum + parseFloat(t.TotalAmount || 0), 0).toFixed(2)}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Total Tickets</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {transactions.reduce((sum, t) => sum + (t.TransactionTickets?.length || 0), 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="container mx-auto px-6 py-8">
                {transactions.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-4">🎫</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
                        <p className="text-gray-600">
                            You haven't made any ticket purchases yet.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="col-span-3 md:col-span-2 text-sm font-semibold text-gray-700">Transaction</div>
                            <div className="col-span-3 md:col-span-2 text-sm font-semibold text-gray-700">Date</div>
                            <div className="col-span-2 text-sm font-semibold text-gray-700">Tickets</div>
                            <div className="col-span-2 text-sm font-semibold text-gray-700">Amount</div>
                            <div className="col-span-2 text-sm font-semibold text-gray-700">Status</div>
                            <div className="col-span-2 md:col-span-1 text-sm font-semibold text-gray-700">Action</div>
                        </div>

                        {/* Transactions List */}
                        <div className="divide-y divide-gray-100">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.TransactionId}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                                >
                                    {/* Transaction Code */}
                                    <div className="col-span-3 md:col-span-2">
                                        <div className="font-medium text-gray-900">
                                            {transaction.TransactionCode}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {transaction.PaymentType}
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="col-span-3 md:col-span-2">
                                        <div className="font-medium text-gray-900">
                                            {formatDate(transaction.TransactionDate)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formatTime(transaction.TransactionDate)}
                                        </div>
                                    </div>

                                    {/* Tickets Count */}
                                    <div className="col-span-2">
                                        <div className="font-medium text-gray-900">
                                            {transaction.TransactionTickets?.length || 0}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            tickets
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="col-span-2">
                                        <div className="font-bold text-gray-900">
                                            {formatPrice(transaction.TotalAmount)}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(transaction.Status)}`}>
                                            {getStatusText(transaction.Status)}
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div className="col-span-2 md:col-span-1">
                                        <Link
                                            to={`/ticketHistory/${transaction.TransactionId}/details`}
                                            className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};