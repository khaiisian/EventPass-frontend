import React, {useEffect, useState} from 'react'
import {deleteVenueType, getVenueTypes} from "../../../api/venueType.js";
import {Link} from "react-router-dom";

export const VenueTypeList = () => {
    const [venueTypes, setVenueTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVenues = async () => {
        try{
            const response = await getVenueTypes();
            setVenueTypes(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchVenues();
    }, []);

    const handleDelete = async (id) => {
        if(!confirm('Are you sure you want to delete this venue?')){
            return;
        }
        try{
            await deleteVenueType(id);
            fetchVenues();
        } catch (error) {
            console.log(error);
        }
    }

    if(loading){
        return <div>Loading...</div>;
    }

    return (
        <div className="px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 md:px-6 py-5 border-b border-gray-100 mb-6">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Venue Type Management
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base mt-1">
                        View and manage all system venue types
                    </p>
                </div>
                <Link
                    to="/admin/venuetypes/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition text-sm md:text-base flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add VenueType
                </Link>
            </div>

            <div className="border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                        <tr>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">
                                Venue Type Code
                            </th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-left uppercase tracking-wider">
                                Venue Type Name
                            </th>
                            <th className="text-sm font-semibold text-gray-100 px-6 py-4 text-center uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                        {venueTypes.map(venuetype => (
                            <tr
                                key={venuetype.VenueTypeId}
                                className="hover:bg-purple-50/50 transition-colors"
                            >
                                <td className="px-6 py-4">
            <span className="font-medium text-gray-900 text-sm md:text-base">
                {venuetype.VenueTypeCode}
            </span>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 text-sm md:text-base">
                                        {venuetype.VenueTypeName}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 min-w-[140px]">
                                        <Link
                                            to={`/admin/venuetypes/${venuetype.VenueTypeId}/edit`}
                                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg font-medium transition text-sm flex-1 text-center"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(venuetype.VenueTypeId)}
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

                {venueTypes.length === 0 && (
                    <div className="py-12 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No venue types found</h3>
                        <p className="text-gray-500 text-sm">Get started by adding your first venue types.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
