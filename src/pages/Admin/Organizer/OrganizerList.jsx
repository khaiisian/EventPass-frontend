import React, { useEffect, useState } from 'react'
import { getOrganizers, deleteOrganizer } from "../../../api/organizer.js";
import { Link } from "react-router-dom";

export const OrganizerList = () => {
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const fetchOrganizers = async (page = 1) => {
        try {
            const response = await getOrganizers({ page, per_page: 10 });
            setOrganizers(response.data.data);
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
        fetchOrganizers();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this organizer?')) {
            return;
        }
        try {
            await deleteOrganizer(id);
            fetchOrganizers(pagination.current_page);
        } catch (error) {
            console.log(error);
        }
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
            fetchOrganizers(page);
        }
    }

    if (loading) {
        return (
            <div className="px-4 md:px-6 lg:px-8 py-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading organizers...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Organizers</h1>
                    <p className="text-gray-600 mt-1">
                        Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                        {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                        of {pagination.total} organizers
                    </p>
                </div>
                <Link
                    to="/admin/organizers/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Organizer
                </Link>
            </div>

            {/* Table Container */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-white">Organizer Code</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Name</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Email</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Phone</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Address</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {organizers.map(organizer => (
                            <tr
                                key={organizer.OrganizerId}
                                className="border-b border-gray-100 hover:bg-gray-50"
                            >
                                {/* Organizer Code */}
                                <td className="py-5 px-6">
                                    <div className="font-mono font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded text-sm inline-block">
                                        {organizer.OrganizerCode}
                                    </div>
                                </td>

                                {/* Name */}
                                <td className="py-5 px-6">
                                    <div className="font-medium text-gray-900">
                                        {organizer.OrganizerName}
                                    </div>
                                </td>

                                {/* Email */}
                                <td className="py-5 px-6">
                                    <div className="text-gray-700">
                                        {organizer.Email || '-'}
                                    </div>
                                </td>

                                {/* Phone Number */}
                                <td className="py-5 px-6">
                                    <div className="text-gray-700">
                                        {organizer.PhNumber || '-'}
                                    </div>
                                </td>

                                {/* Address */}
                                <td className="py-5 px-6 max-w-md">
                                    <div className="text-gray-700 text-sm">
                                        {organizer.Address || '-'}
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="py-5 px-6">
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/admin/organizers/${organizer.OrganizerId}/edit`}
                                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(organizer.OrganizerId)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
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
                        <div className="text-gray-400 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No organizers found</h3>
                        <p className="text-gray-500">Get started by adding your first organizer.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
                <div className="flex justify-between items-center mt-6 px-4 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                        {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                        of {pagination.total} organizers
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
                                                    ? 'bg-purple-600 text-white'
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