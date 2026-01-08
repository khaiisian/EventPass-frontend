import React, { useEffect, useState } from 'react'
import { deleteVenueType, getVenueTypes } from "../../../api/venueType.js";
import { Link } from "react-router-dom";

export const VenueTypeList = () => {
    const [venueTypes, setVenueTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const fetchVenueTypes = async (page = 1) => {
        try {
            const response = await getVenueTypes({ page, per_page: 10 });
            setVenueTypes(response.data.data);
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
        fetchVenueTypes();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this venue type?')) {
            return;
        }
        try {
            await deleteVenueType(id);
            fetchVenueTypes(pagination.current_page);
        } catch (error) {
            console.log(error);
        }
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
            fetchVenueTypes(page);
        }
    }

    if (loading) {
        return (
            <div className="px-4 md:px-6 lg:px-8 py-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading venue types...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Venue Types</h1>
                    <p className="text-gray-600 mt-1">
                        Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                        {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                        of {pagination.total} venue types
                    </p>
                </div>
                <Link
                    to="/admin/venuetypes/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Venue Type
                </Link>
            </div>

            {/* Table Container */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-white">Venue Type Code</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Venue Type Name</th>
                            <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {venueTypes.map(venuetype => (
                            <tr
                                key={venuetype.VenueTypeId}
                                className="border-b border-gray-100 hover:bg-gray-50"
                            >
                                {/* Venue Type Code */}
                                <td className="py-5 px-6">
                                    <div className="font-mono font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded text-sm inline-block">
                                        {venuetype.VenueTypeCode}
                                    </div>
                                </td>

                                {/* Venue Type Name */}
                                <td className="py-5 px-6">
                                    <div className="font-medium text-gray-900">
                                        {venuetype.VenueTypeName}
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="py-5 px-6">
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/admin/venuetypes/${venuetype.VenueTypeId}/edit`}
                                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(venuetype.VenueTypeId)}
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
                {venueTypes.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No venue types found</h3>
                        <p className="text-gray-500">Get started by adding your first venue type.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
                <div className="flex justify-between items-center mt-6 px-4 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                        {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                        of {pagination.total} venue types
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