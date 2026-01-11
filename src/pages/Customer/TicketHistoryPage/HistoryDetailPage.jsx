import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTransactionById } from '../../../api/transactionApi.js';

export const HistoryDetailPage = () => {
    const { id } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTransactionDetails();
    }, [id]);

    const fetchTransactionDetails = async () => {
        try {
            setLoading(true);
            const response = await getTransactionById(id);
            if (response.data.status === 'success' || response.data.status === true) {
                setTransaction(response.data.data);
            } else {
                setError('Failed to load transaction details');
            }
        } catch (err) {
            console.error('Error fetching transaction details:', err);
            setError('Failed to load transaction details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatShortDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
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
                    <p className="text-gray-600">Loading transaction details...</p>
                </div>
            </div>
        );
    }

    if (error || !transaction) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Transaction not found</h3>
                    <p className="text-gray-600 mb-6">
                        {error || 'The transaction you are looking for does not exist.'}
                    </p>
                    <Link
                        to="/transactions"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Transactions
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/transactions"
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
                                <p className="text-gray-600 text-sm mt-1">
                                    View complete information about this purchase
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2">
                        {/* Transaction Overview Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-3xl font-bold text-gray-900">
                                                {transaction.TransactionCode}
                                            </h2>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(transaction.Status)}`}>
                                                {getStatusText(transaction.Status)}
                                            </span>
                                        </div>
                                        <div className="text-gray-600">
                                            {formatDate(transaction.TransactionDate)}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-4xl font-bold text-gray-900">
                                            {formatPrice(transaction.TotalAmount)}
                                        </div>
                                        <div className="text-gray-600 mt-1">
                                            Total Amount
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Payment Method</div>
                                                <div className="font-medium text-gray-900">{transaction.PaymentType}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Email Address</div>
                                                <div className="font-medium text-gray-900">{transaction.Email}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Transaction ID</div>
                                                <div className="font-mono font-medium text-gray-900">{transaction.TransactionId}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">User Code</div>
                                                <div className="font-mono font-medium text-gray-900">{transaction.User?.UserCode}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tickets Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Tickets ({transaction.TransactionTickets?.length || 0})</h3>

                            <div className="space-y-4">
                                {transaction.TransactionTickets?.map((ticket) => (
                                    <div
                                        key={ticket.TransactionTicketId}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            Ticket: {ticket.TransactionTicketCode}
                                                        </h4>
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            Ticket ID: <span className="font-mono">{ticket.TransactionTicketId}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-bold text-gray-900">
                                                            {formatPrice(ticket.Price)}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Price
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <div className="text-sm text-gray-600 mb-2">Ticket Type</div>
                                                    <div className="font-medium text-gray-900">
                                                        Type ID: <span className="font-mono">{ticket.TicketTypeId}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* QR Code */}
                                            <div className="flex-shrink-0">
                                                {ticket.QrImage && (
                                                    <div className="text-center">
                                                        <div className="text-sm text-gray-600 mb-2">QR Code</div>
                                                        <img
                                                            src={ticket.QrImage}
                                                            alt={`QR Code for ${ticket.TransactionTicketCode}`}
                                                            className="w-32 h-32 object-contain border border-gray-200 rounded-lg"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://via.placeholder.com/128?text=QR+Code';
                                                            }}
                                                        />
                                                        <div className="text-xs text-gray-500 mt-2">
                                                            Scan for entry
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - User Info & Actions */}
                    <div className="lg:col-span-1">
                        {/* User Information Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Full Name</div>
                                    <div className="font-medium text-gray-900">{transaction.User?.UserName}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Email</div>
                                    <div className="font-medium text-gray-900">{transaction.User?.Email}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Phone Number</div>
                                    <div className="font-medium text-gray-900">{transaction.User?.PhNumber || 'N/A'}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500 mb-1">User Code</div>
                                    <div className="font-mono font-medium text-gray-900">{transaction.User?.UserCode}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Role</div>
                                    <div className="font-medium text-gray-900">{transaction.User?.Role}</div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="text-sm text-gray-500 mb-1">Account Created</div>
                                    <div className="font-medium text-gray-900">
                                        {formatShortDate(transaction.User?.CreatedAt)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Metadata Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Metadata</h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Created By</div>
                                    <div className="font-medium text-gray-900">{transaction.CreatedBy}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Created At</div>
                                    <div className="font-medium text-gray-900">{formatDate(transaction.CreatedAt)}</div>
                                </div>

                                {transaction.ModifiedBy && (
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Last Modified By</div>
                                        <div className="font-medium text-gray-900">{transaction.ModifiedBy}</div>
                                    </div>
                                )}

                                {transaction.ModifiedAt && (
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Last Modified At</div>
                                        <div className="font-medium text-gray-900">{formatDate(transaction.ModifiedAt)}</div>
                                    </div>
                                )}

                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Transaction Status</div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        !transaction.DeleteFlag
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : 'bg-red-100 text-red-700 border border-red-200'
                                    }`}>
                                        {!transaction.DeleteFlag ? 'Active' : 'Deleted'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>

                            <div className="space-y-3">
                                <Link
                                    to="/transactions"
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Transactions
                                </Link>

                                <button
                                    onClick={() => window.print()}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};