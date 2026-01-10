import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getEventById } from '../../../api/event'

export const EventDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [quantities, setQuantities] = useState({})

    useEffect(() => {
        fetchEvent()
    }, [id])

    const fetchEvent = async () => {
        try {
            setLoading(true)
            const response = await getEventById(id)
            if (response.data.status) {
                setEvent(response.data.data)
                // Initialize quantities to 0 for each ticket type
                const initialQuantities = response.data.data.TicketType.reduce((acc, ticket) => {
                    acc[ticket.TicketTypeId] = 0
                    return acc
                }, {})
                setQuantities(initialQuantities)
            } else {
                setError('Failed to fetch event data')
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching event details')
            console.error('Error fetching event:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Date TBD'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleQuantityChange = (ticketTypeId, value) => {
        const ticket = event.TicketType.find(t => t.TicketTypeId === ticketTypeId)
        // Calculate available quantity if not provided
        const availableQuantity = ticket.AvailableQuantity || (ticket.TotalQuantity - (ticket.SoldQuantity || 0))
        const numValue = parseInt(value) || 0
        if (numValue >= 0 && numValue <= availableQuantity) {
            setQuantities(prev => ({
                ...prev,
                [ticketTypeId]: numValue
            }))
        }
    }

    const handleIncrement = (ticketTypeId) => {
        const ticket = event.TicketType.find(t => t.TicketTypeId === ticketTypeId)
        const availableQuantity = ticket.AvailableQuantity || (ticket.TotalQuantity - (ticket.SoldQuantity || 0))
        if (quantities[ticketTypeId] < availableQuantity) {
            setQuantities(prev => ({
                ...prev,
                [ticketTypeId]: prev[ticketTypeId] + 1
            }))
        }
    }

    const handleDecrement = (ticketTypeId) => {
        if (quantities[ticketTypeId] > 0) {
            setQuantities(prev => ({
                ...prev,
                [ticketTypeId]: prev[ticketTypeId] - 1
            }))
        }
    }

    const handleCheckout = () => {
        const selectedTickets = event.TicketType
            .filter(ticket => quantities[ticket.TicketTypeId] > 0)
            .map(ticket => ({
                TicketTypeId: ticket.TicketTypeId,
                TicketTypeCode: ticket.TicketTypeCode, // Add this line
                TicketTypeName: ticket.TicketTypeName,
                Price: ticket.Price,
                Quantity: quantities[ticket.TicketTypeId],
                Subtotal: parseFloat(ticket.Price) * quantities[ticket.TicketTypeId]
            }))

        const totalTickets = selectedTickets.reduce((sum, ticket) => sum + ticket.Quantity, 0)
        const totalAmount = selectedTickets.reduce((sum, ticket) => sum + ticket.Subtotal, 0)

        const checkoutData = {
            event: {
                EventId: event.EventId,
                EventName: event.EventName,
                StartDate: event.StartDate,
                Venue: event.Venue?.VenueName,
                Address: event.Venue?.Address,
                EventImage: event.EventImage
            },
            tickets: selectedTickets,
            totalTickets,
            totalAmount
        }

        navigate('/checkout', { state: checkoutData })
    }

    const getEventStatusText = (statusCode) => {
        switch (statusCode) {
            case 1: return 'UPCOMING'
            case 2: return 'ONGOING'
            case 3: return 'COMPLETED'
            case 4: return 'CANCELLED'
            default: return 'PENDING'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading event details...</p>
                </div>
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="text-red-600 mb-4">{error || 'Event not found'}</div>
                    <Link
                        to="/events"
                        className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        ← Back to Events
                    </Link>
                </div>
            </div>
        )
    }

    const totalSelectedTickets = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
    const totalPrice = event.TicketType.reduce((sum, ticket) => {
        return sum + (parseFloat(ticket.Price) * quantities[ticket.TicketTypeId])
    }, 0)

    const eventStatus = getEventStatusText(event.EventStatus)
    const isSoldOut = event.TotalTicketQuantity && event.SoldOutTicketQuantity >= event.TotalTicketQuantity
    const availableTickets = (event.TotalTicketQuantity || 0) - (event.SoldOutTicketQuantity || 0)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/events"
                                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Events
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                                {availableTickets.toLocaleString()} tickets available
                            </div>
                            {isSoldOut && (
                                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                                    Sold Out
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Event Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="flex flex-col lg:flex-row">
                        {/* Event Image */}
                        <div className="lg:w-1/2">
                            <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
                                <img
                                    src={event.EventImage}
                                    alt={event.EventName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Event Info */}
                        <div className="lg:w-1/2 p-8">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                        {event.EventType?.EventTypeName || 'Event'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        eventStatus === 'UPCOMING' ? 'bg-blue-100 text-blue-700' :
                                            eventStatus === 'ONGOING' ? 'bg-green-100 text-green-700' :
                                                eventStatus === 'COMPLETED' ? 'bg-gray-100 text-gray-700' :
                                                    eventStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {eventStatus}
                                    </span>
                                </div>

                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    {event.EventName}
                                </h1>

                                <div className="flex items-center gap-6 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{formatDateTime(event.StartDate)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Venue Info */}
                            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            {event.Venue?.VenueName || 'Venue TBD'}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {event.Venue?.Address || 'Location to be announced'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Capacity</div>
                                        <div className="font-semibold text-gray-900">
                                            {event.Venue?.Capacity?.toLocaleString() || 'N/A'} seats
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">Total Tickets</div>
                                    <div className="text-xl font-bold text-gray-900">
                                        {event.TotalTicketQuantity?.toLocaleString() || '0'}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">Available</div>
                                    <div className="text-xl font-bold text-blue-600">
                                        {availableTickets.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Organizer Info */}
                            <div className="border-t pt-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Organized by</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-purple-600 font-bold">
                                            {event.Organizer?.OrganizerName?.charAt(0) || 'O'}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {event.Organizer?.OrganizerName || 'Organizer'}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Professional event organizer
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ticket Selection Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Ticket Types */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Tickets</h2>

                            <div className="space-y-6">
                                {event.TicketType?.map(ticket => {
                                    const availableQuantity = ticket.AvailableQuantity || (ticket.TotalQuantity - (ticket.SoldQuantity || 0))
                                    const isSoldOut = availableQuantity <= 0

                                    return (
                                        <div key={ticket.TicketTypeId} className={`border rounded-xl p-6 transition-all ${
                                            isSoldOut ? 'border-gray-200 bg-gray-50' : 'border-gray-200 hover:border-purple-300'
                                        }`}>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                                {ticket.TicketTypeName}
                                                            </h3>
                                                            <p className="text-gray-600 text-sm">
                                                                ${parseFloat(ticket.Price || 0).toFixed(2)} per ticket
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-gray-900">
                                                                ${parseFloat(ticket.Price || 0).toFixed(2)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">each</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6 text-sm">
                                                        <div className="text-gray-600">
                                                            <span className="font-medium">{ticket.TotalQuantity || 0}</span> total tickets
                                                        </div>
                                                        <div className={`${isSoldOut ? 'text-red-600' : 'text-green-600'}`}>
                                                            <span className="font-medium">{availableQuantity}</span> available
                                                        </div>
                                                        {isSoldOut && (
                                                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                                                                Sold Out
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Quantity Selector */}
                                                {!isSoldOut && (
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDecrement(ticket.TicketTypeId)}
                                                            disabled={quantities[ticket.TicketTypeId] === 0}
                                                            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                            </svg>
                                                        </button>

                                                        <div className="text-center">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={availableQuantity}
                                                                value={quantities[ticket.TicketTypeId]}
                                                                onChange={(e) => handleQuantityChange(ticket.TicketTypeId, e.target.value)}
                                                                className="w-16 text-center border border-gray-300 rounded-lg py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                            />
                                                            <div className="text-xs text-gray-500 mt-1">Qty</div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleIncrement(ticket.TicketTypeId)}
                                                            disabled={quantities[ticket.TicketTypeId] >= availableQuantity}
                                                            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {event.TicketType?.map(ticket => {
                                    const qty = quantities[ticket.TicketTypeId]
                                    if (qty === 0) return null

                                    return (
                                        <div key={ticket.TicketTypeId} className="flex justify-between items-center">
                                            <div>
                                                <div className="text-gray-900 font-medium">{ticket.TicketTypeName}</div>
                                                <div className="text-sm text-gray-500">{qty} × ${parseFloat(ticket.Price || 0).toFixed(2)}</div>
                                            </div>
                                            <div className="font-semibold text-gray-900">
                                                ${(parseFloat(ticket.Price || 0) * qty).toFixed(2)}
                                            </div>
                                        </div>
                                    )
                                })}

                                {totalSelectedTickets === 0 && (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 mb-2">
                                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">Select tickets to see total</p>
                                    </div>
                                )}
                            </div>

                            {totalSelectedTickets > 0 && (
                                <>
                                    <div className="border-t border-gray-200 pt-4 space-y-3">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tickets</span>
                                            <span>{totalSelectedTickets}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-gray-900">
                                            <span>Total</span>
                                            <span>${totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        <button
                                            onClick={handleCheckout}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors"
                                        >
                                            Continue to Checkout
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const resetQuantities = event.TicketType.reduce((acc, ticket) => {
                                                    acc[ticket.TicketTypeId] = 0
                                                    return acc
                                                }, {})
                                                setQuantities(resetQuantities)
                                            }}
                                            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Clear Selection
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}