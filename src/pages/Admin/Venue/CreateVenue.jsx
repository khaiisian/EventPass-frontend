import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createVenue } from "../../../api/venue.js";
import {getVenueTypes} from "../../../api/venueType.js";

export const CreateVenue = () => {
    const [venueTypes, setVenueTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        VenueName: "",
        VenueTypeId: "",
        Description: "",
        Address: "",
        VenueImage: null,
        Capacity: "",
    });

    const fetchVenueTypes = async () => {
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
        fetchVenueTypes();
    }, []);

    const handleSubmit = async (e) => {
        setError(null);
        e.preventDefault();

        const formData = new FormData();
        for (const key in form) {
            if (key === "VenueImage" && form[key] instanceof File) {
                formData.append(key, form[key]);
            } else if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
                formData.append(key, form[key]);
            }
        }

        try {
            await createVenue(formData);
            navigate("/admin/venues");
        } catch (err) {
            console.error(err.response?.data);
            setError(err.response?.data?.message || "Error creating venue");
        }
    };

    const handleOnChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "VenueImage") {
            setForm((prev) => ({ ...prev, VenueImage: files[0] || null }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    if(loading){
        return <div>Loading...</div>;
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="mt-6 border border-gray-200 shadow-xl rounded-2xl overflow-hidden bg-white p-6 md:p-8 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-100">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Venue</h1>
                        <p className="text-gray-500 mt-2">Add a new venue to the system</p>
                    </div>
                    <Link
                        to="/admin/venues"
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-base font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to List
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && <div className="text-red-600 mb-4">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Venue Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="VenueName" className="block font-medium text-gray-700">
                                Venue Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="VenueName"
                                value={form.VenueName}
                                name="VenueName"
                                onChange={handleOnChange}
                                required
                                placeholder="Enter venue name"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="VenueTypeId" className="block font-medium text-gray-700">
                                Venue Type <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="VenueTypeId"
                                    name="VenueTypeId"
                                    onChange={handleOnChange}
                                    value={form.VenueTypeId}
                                    required
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
                                    disabled={loading}
                                >
                                    <option value="" className="text-gray-400">Select venue type</option>
                                    {venueTypes.map(venueType => (
                                        <option
                                            key={venueType.VenueTypeId}
                                            value={venueType.VenueTypeId}
                                            className="py-2 px-3 text-gray-700 hover:bg-purple-50"
                                        >
                                            {venueType.VenueTypeName}
                                        </option>
                                    ))}
                                </select>
                                {/* Custom dropdown arrow */}
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Address Field */}
                        <div className="space-y-2">
                            <label htmlFor="Address" className="block font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                id="Address"
                                value={form.Address}
                                name="Address"
                                onChange={handleOnChange}
                                placeholder="Enter venue address"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Capacity Field */}
                        <div className="space-y-2">
                            <label htmlFor="Capacity" className="block font-medium text-gray-700">
                                Capacity
                            </label>
                            <input
                                type="number"
                                id="Capacity"
                                value={form.Capacity}
                                name="Capacity"
                                onChange={handleOnChange}
                                min="0"
                                placeholder="Enter venue capacity"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Description Field - Full width */}
                        <div className="md:col-span-2 space-y-2">
                            <label htmlFor="Description" className="block font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="Description"
                                value={form.Description}
                                name="Description"
                                onChange={handleOnChange}
                                rows="4"
                                placeholder="Enter venue description..."
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <label className="block font-medium text-gray-700">
                            Venue Image
                        </label>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                            {/* Square Preview/Upload Area */}
                            <div className="flex flex-col items-center gap-4">
                                {/* Square Container */}
                                <div className="relative">
                                    {form.VenueImage ? (
                                        <div className="w-64 h-48 rounded-xl border-4 border-purple-200 overflow-hidden shadow-md">
                                            <img
                                                src={typeof form.VenueImage === 'string'
                                                    ? form.VenueImage
                                                    : URL.createObjectURL(form.VenueImage)}
                                                alt="Venue preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-64 h-48 rounded-xl border-4 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <label
                                        htmlFor="VenueImage"
                                        className="absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <input
                                            type="file"
                                            id="VenueImage"
                                            name="VenueImage"
                                            onChange={handleOnChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <span className="text-sm text-gray-500">
                                    Click the camera icon to upload (JPG, PNG, WEBP, max 2MB)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                        <Link
                            to="/admin/venues" // Adjust the cancel route as needed
                            className="px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl text-base font-semibold transition-colors shadow-sm hover:shadow-md"
                        >
                            Create Venue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};