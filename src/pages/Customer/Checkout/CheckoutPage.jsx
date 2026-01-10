import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {buyTickets} from "../../../api/transactionApi.js";

export const CheckoutPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const checkoutData = location.state

    if (!checkoutData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">No booking data found</p>
                    <Link
                        to="/events"
                        className="text-purple-600 hover:text-purple-700"
                    >
                        Go back to events
                    </Link>
                </div>
            </div>
        )
    }

    const [paymentMethod, setPaymentMethod] = useState('creditCard')

    const formatPaymentType = (method) => {
        switch (method) {
            case 'creditCard': return 'CreditCard'
            case 'paypal': return 'PayPal'
            case 'bank': return 'BankTransfer'
            default: return 'CreditCard'
        }
    }

    const handleConfirm = async () => {
        try {
            setLoading(true)
            setError(null)

            const requestData = {
                EventId: checkoutData.event.EventId,
                PaymentType: formatPaymentType(paymentMethod),
                Tickets: checkoutData.tickets.map(ticket => ({
                    TicketTypeCode: ticket.TicketTypeCode || `TT${String(ticket.TicketTypeId).padStart(4, '0')}`,
                    Quantity: ticket.Quantity
                }))
            }

            console.log('Sending data to API:', requestData)

            const response = await buyTickets(requestData)

            if (response.data.status === "success" || response.data.status === true || response.data.statusCode === 200) {
                const bookingData = {
                    ...checkoutData,
                    paymentMethod,
                    paymentType: formatPaymentType(paymentMethod),
                    bookingDate: new Date().toISOString(),
                    transactionData: response.data.data
                }

                console.log('Booking confirmed:', bookingData)

                // navigate('/booking-confirmed', {
                //     state: bookingData
                // })

                navigate('/');
            } else {
                throw new Error(response.data.message || 'Failed to process payment')
            }
        } catch (err) {
            console.error('Error processing payment:', err)
            setError(err.response?.data?.message || err.message || 'Failed to process payment. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to={`/events/${checkoutData.event.EventId}/details`}
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Event
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Event Info */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {checkoutData.event.EventName}
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDate(checkoutData.event.StartDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{checkoutData.event.Venue}, {checkoutData.event.Address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Tickets</h3>
                                <div className="space-y-4">
                                    {checkoutData.tickets.map((ticket, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{ticket.TicketTypeName}</div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        ${parseFloat(ticket.Price).toFixed(2)} × {ticket.Quantity}
                                                    </div>
                                                </div>
                                                <div className="font-bold text-gray-900">
                                                    ${ticket.Subtotal.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div className="text-lg font-bold text-gray-900">Total</div>
                                        <div className="text-2xl font-bold text-purple-600">
                                            ${checkoutData.totalAmount.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-2 text-center">
                                        {checkoutData.totalTickets} tickets
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>

                                <div className="space-y-3 mb-6">
                                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="creditCard"
                                            checked={paymentMethod === 'creditCard'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-purple-600"
                                            disabled={loading}
                                        />
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center">
                                                <span className="text-white font-bold">CC</span>
                                            </div>
                                            <div>
                                                <div className="font-medium">Credit Card</div>
                                                <div className="text-sm text-gray-500">Visa, Mastercard, Amex</div>
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="paypal"
                                            checked={paymentMethod === 'paypal'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-purple-600"
                                            disabled={loading}
                                        />
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-8 bg-blue-300 rounded flex items-center justify-center">
                                                <span className="text-white font-bold">PP</span>
                                            </div>
                                            <div>
                                                <div className="font-medium">PayPal</div>
                                                <div className="text-sm text-gray-500">Pay with PayPal account</div>
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="bank"
                                            checked={paymentMethod === 'bank'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-purple-600"
                                            disabled={loading}
                                        />
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-8 bg-green-500 rounded flex items-center justify-center">
                                                <span className="text-white font-bold">BT</span>
                                            </div>
                                            <div>
                                                <div className="font-medium">Bank Transfer</div>
                                                <div className="text-sm text-gray-500">Direct bank payment</div>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    className={`w-full py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                                        loading
                                            ? 'bg-purple-400 cursor-not-allowed'
                                            : 'bg-purple-600 hover:bg-purple-700'
                                    } text-white`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </button>

                                <div className="mt-4 text-center text-sm text-gray-500">
                                    Your tickets will be emailed after payment
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}