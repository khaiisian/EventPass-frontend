import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTransactionById, updateTransaction } from "../../../api/transactionApi.js";

export const TransactionDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [transaction, setTransaction] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState(null)

    const fetchTransaction = async () => {
        try {
            setLoading(true)
            const response = await getTransactionById(id)
            setTransaction(response.data.data)
        } catch (error) {
            console.error('Error fetching transaction:', error)
            setError('Failed to load transaction details')
        } finally {
            setLoading(false)
        }
    }

    const handleApproveTransaction = async () => {
        if (!window.confirm('Are you sure you want to approve this transaction? This action cannot be undone.')) {
            return
        }

        try {
            setUpdating(true)
            const response = await updateTransaction(id, { Status: true })

            if (response.data.status) {
                // Update local state
                setTransaction(prev => ({
                    ...prev,
                    Status: true,
                    ModifiedAt: new Date().toISOString()
                }))

                // Show success message
                alert('Transaction approved successfully!')

                // Refresh transaction data
                fetchTransaction()
            } else {
                alert('Failed to approve transaction: ' + response.data.message)
            }
        } catch (error) {
            console.error('Error approving transaction:', error)
            alert(error.response?.data?.message || 'Failed to approve transaction')
        } finally {
            setUpdating(false)
        }
    }

    useEffect(() => {
        fetchTransaction()
    }, [id])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount)
    }

    const getStatusClass = (status) => {
        return status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
    }

    const getStatusText = (status) => {
        return status ? 'Completed' : 'Pending'
    }

    if (loading) {
        return (
            <div className="px-4 md:px-6 lg:px-8 py-6">
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <div className="text-gray-500">Loading transaction details...</div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="px-4 md:px-6 lg:px-8 py-6">
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="text-red-500 text-4xl mb-4">⚠️</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Transaction</h3>
                        <p className="text-gray-500 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/admin/transactions')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                            Back to Transactions
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!transaction) {
        return (
            <div className="px-4 md:px-6 lg:px-8 py-6">
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="text-gray-400 text-4xl mb-4">📄</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Not Found</h3>
                        <p className="text-gray-500 mb-6">The requested transaction could not be found.</p>
                        <button
                            onClick={() => navigate('/admin/transactions')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                            Back to Transactions
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/admin/transactions')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Transactions
                </button>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Transaction #{transaction.TransactionCode}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(transaction.Status)}`}>
                                {getStatusText(transaction.Status)}
                            </span>
                            <span className="text-gray-500 text-sm">
                                {formatDate(transaction.TransactionDate)}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">
                            {formatCurrency(transaction.TotalAmount)}
                        </div>
                        <div className="text-gray-500 text-sm">Total Amount</div>
                    </div>
                </div>

                {/* Action Buttons */}
                {!transaction.Status && (
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleApproveTransaction}
                            disabled={updating}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Approving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Approve Transaction
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Customer & Payment Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">CUSTOMER</h3>
                        <div className="space-y-2">
                            <div className="text-gray-900 font-medium">{transaction.User?.UserName || 'Customer'}</div>
                            <div className="text-gray-600">{transaction.Email}</div>
                            {transaction.User?.PhNumber && (
                                <div className="text-gray-600">{transaction.User.PhNumber}</div>
                            )}
                            <div className="text-sm text-gray-500">
                                ID: #{transaction.UserId} • {transaction.User?.UserCode || 'N/A'}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">PAYMENT</h3>
                        <div className="space-y-2">
                            <div className="text-gray-900 font-medium">{transaction.PaymentType || 'Not Specified'}</div>
                            <div className="text-sm text-gray-600">
                                Created by: {transaction.CreatedBy}
                            </div>
                            <div className="text-sm text-gray-500">
                                Transaction ID: {transaction.TransactionId}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tickets Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Tickets</h2>
                    <div className="text-gray-500">
                        {transaction.TransactionTickets?.length || 0} items
                    </div>
                </div>

                {transaction.TransactionTickets && transaction.TransactionTickets.length > 0 ? (
                    <div className="space-y-4">
                        {transaction.TransactionTickets.map((ticket) => (
                            <div key={ticket.TransactionTicketId} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {ticket.TransactionTicketCode}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Ticket ID: {ticket.TicketTypeId}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">
                                            {formatCurrency(ticket.Price)}
                                        </div>
                                        <a
                                            href={ticket.QrImage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center mt-1"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View QR
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No tickets associated with this transaction
                    </div>
                )}
            </div>

            {/* QR Codes Preview */}
            {transaction.TransactionTickets && transaction.TransactionTickets.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">QR Codes</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {transaction.TransactionTickets.map((ticket) => (
                            <div key={ticket.TransactionTicketId} className="text-center">
                                <img
                                    src={ticket.QrImage}
                                    alt="QR Code"
                                    className="w-full max-w-32 h-32 mx-auto border border-gray-200 rounded"
                                />
                                <div className="mt-2 text-sm text-gray-600 truncate">
                                    {ticket.TransactionTicketCode}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {formatCurrency(ticket.Price)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}