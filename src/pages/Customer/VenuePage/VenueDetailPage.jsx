import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getVenueById } from '../../../api/venue.js'

export const VenueDetails = () => {
    const { id } = useParams()
    const [venue, setVenue] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchVenueDetails()
    }, [id])

    const fetchVenueDetails = async () => {
        try {
            setLoading(true)
            const response = await getVenueById(id)
            if (response.data.status === true) {
                setVenue(response.data.data)
            } else {
                setError('Failed to load venue details')
            }
        } catch (err) {
            console.error('Error fetching venue:', err)
            setError('Failed to load venue details')
        } finally {
            setLoading(false)
        }
    }

    const getVenueImage = () => {
        if (venue?.VenueImage) {
            return venue.VenueImage
        }
        return 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=1200&q=80'
    }

    const formatCapacity = (capacity) => {
        if (!capacity) return '0'
        if (capacity >= 1000) {
            return `${(capacity / 1000).toFixed(1)}k`
        }
        return capacity.toLocaleString()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading venue details...</p>
                </div>
            </div>
        )
    }

    if (error || !venue) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-gray-400 text-6xl mb-4">🏟️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Venue not found</h3>
                    <p className="text-gray-600 mb-6">
                        {error || 'The venue you are looking for does not exist.'}
                    </p>
                    <Link
                        to="/venues"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Venues
                    </Link>
                </div>
            </div>
        )
    }

    const venueType = venue.venueType?.VenueTypeName || 'Unknown'

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/venues"
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{venue.VenueName}</h1>
                                <p className="text-gray-600 text-sm mt-1">
                                    {venueType} • {formatCapacity(venue.Capacity)} capacity
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2">
                        {/* Venue Image & Basic Info */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                            <div className="relative h-64 md:h-80">
                                <img
                                    src={getVenueImage()}
                                    alt={venue.VenueName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-4 left-4">
                                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                        {venueType}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        {venue.VenueName}
                                    </h2>

                                    {/* Address */}
                                    <div className="flex items-start gap-3 mb-6">
                                        <svg className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Location</div>
                                            <div className="text-gray-900 font-medium">{venue.Address}</div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About this Venue</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {venue.Description}
                                        </p>
                                    </div>
                                </div>

                                {/* Capacity Info */}
                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacity</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-4xl font-bold text-gray-900">
                                                {venue.Capacity.toLocaleString()}
                                            </div>
                                            <div className="text-gray-600 mt-1">Total Seating Capacity</div>

                                            {/* Capacity category */}
                                            <div className="mt-4">
                                                <div className="text-sm text-gray-500 mb-2">Capacity Size:</div>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    venue.Capacity < 1000 ? 'bg-green-100 text-green-700 border border-green-200' :
                                                        venue.Capacity < 5000 ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                            venue.Capacity < 20000 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                                                'bg-red-100 text-red-700 border border-red-200'
                                                                                }`}>
                                                    {venue.Capacity < 1000 ? 'Small (Under 1,000)' :
                                                        venue.Capacity < 5000 ? 'Medium (1,000-5,000)' :
                                                            venue.Capacity < 20000 ? 'Large (5,000-20,000)' :
                                                                'Extra Large (20,000+)'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Quick Info & Actions */}
                    <div className="lg:col-span-1">
                        {/* Quick Summary Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Venue Specifications</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{venueType}</div>
                                        <div className="text-sm text-gray-500">Venue Type</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-7.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{venue.Capacity.toLocaleString()}</div>
                                        <div className="text-sm text-gray-500">Maximum Capacity</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Available</div>
                                        <div className="text-sm text-gray-500">Venue Status</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}