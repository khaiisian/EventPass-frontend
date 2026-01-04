import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVenues, deleteVenue } from "../../../api/venue.js";

export const VenueList = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVenues = async () => {
        try {
            const response = await getVenues();
            setVenues(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVenues();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this venue?")) return;

        try {
            await deleteVenue(id);
            fetchVenues();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 md:px-6 py-5 border-b border-gray-100 mb-6">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Venue Management
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base mt-1">
                        View and manage all venues
                    </p>
                </div>
                <Link
                    to="/admin/venues/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition text-sm md:text-base flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Venue
                </Link>
            </div>

            {/* Table */}
            <div className="border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                        <tr>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">
                                Venue Code
                            </th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">
                                Venue Name
                            </th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">
                                Type
                            </th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">
                                Capacity
                            </th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">
                                Address
                            </th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-center uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                        {venues.map((venue) => (
                            <tr
                                key={venue.VenueId}
                                className="hover:bg-purple-50/50 transition-colors"
                            >
                                {/* Venue Code */}
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-900 text-sm md:text-base">
                                        {venue.VenueCode}
                                    </span>
                                </td>

                                {/* Venue Name */}
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 text-sm md:text-base">
                                        {venue.VenueName}
                                    </div>
                                </td>

                                {/* Venue Type */}
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                        {venue.venueType?.VenueTypeName || "-"}
                                    </span>
                                </td>

                                {/* Capacity */}
                                <td className="px-6 py-4">
                                    <div className="text-gray-600 text-sm md:text-base">
                                        {venue.Capacity ?? "-"}
                                    </div>
                                </td>

                                {/* Address */}
                                <td className="px-6 py-4 max-w-xs truncate">
                                    <div className="text-gray-600 text-sm md:text-base">
                                        {venue.Address || "-"}
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 min-w-[140px]">
                                        <Link
                                            to={`/admin/venues/${venue.VenueId}/edit`}
                                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg font-medium transition text-sm flex-1 text-center"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(venue.VenueId)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition text-sm flex-1 text-center"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {venues.length === 0 && (
                    <div className="py-12 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                  d="M3 7h18M3 12h18M3 17h18" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No venues found
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Get started by adding your first venue.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VenueList;
