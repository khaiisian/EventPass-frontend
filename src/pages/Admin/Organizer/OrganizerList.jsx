import React, { useEffect, useState } from 'react'
import { getOrganizers, deleteOrganizer } from "../../../api/organizer.js";
import { Link } from "react-router-dom";

export const OrganizerList = () => {
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrganizers = async () => {
        try {
            const response = await getOrganizers();
            setOrganizers(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrganizers();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this organizer?')) {
            return;
        }
        try {
            await deleteOrganizer(id);
            fetchOrganizers();
        } catch (error) {
            console.log(error);
        }
    }

    if (loading) {
        return (
            <div className="px-4 md:px-6 lg:px-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading organizers...</div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    return (
        <div className="px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 md:px-6 py-5 border-b border-gray-100 mb-6">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Organizer Management
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base mt-1">
                        View and manage all event organizers
                    </p>
                </div>
                <Link
                    to="/admin/organizers/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition text-sm md:text-base flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Organizer
                </Link>
            </div>

            {/* Table Container */}
            <div className="border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                        <tr>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">Organizer Code</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">Name</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">Email</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">Phone</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">Address</th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-center uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                        {organizers.map(organizer => (
                            <tr
                                key={organizer.OrganizerId}
                                className="hover:bg-purple-50/50 transition-colors"
                            >
                                {/* Organizer Code */}
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-900 text-sm md:text-base">
                                        {organizer.OrganizerCode}
                                    </span>
                                </td>

                                {/* Name */}
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 text-sm md:text-base">
                                        {organizer.OrganizerName}
                                    </div>
                                </td>

                                {/* Email */}
                                <td className="px-6 py-4">
                                    <div className="text-gray-600 text-sm md:text-base">
                                        {organizer.Email || '-'}
                                    </div>
                                </td>

                                {/* Phone Number */}
                                <td className="px-6 py-4">
                                    <div className="text-gray-600 text-sm md:text-base">
                                        {organizer.PhNumber || '-'}
                                    </div>
                                </td>

                                {/* Address */}
                                <td className="px-6 py-4">
                                    <div className="text-gray-600 text-sm">
                                        {organizer.Address || '-'}
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 min-w-[140px]">
                                        <Link
                                            to={`/admin/organizers/${organizer.OrganizerId}/edit`}
                                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg font-medium transition text-sm flex-1 text-center"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(organizer.OrganizerId)}
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
                {organizers.length === 0 && (
                    <div className="py-12 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No organizers found</h3>
                        <p className="text-gray-500 text-sm">Get started by adding your first organizer.</p>
                    </div>
                )}
            </div>
        </div>
    );
}