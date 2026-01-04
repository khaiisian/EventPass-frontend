import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getVenueById, updateVenue } from "../../../api/venue.js";
import { getVenueTypes } from "../../../api/venueType.js";

export const EditVenue = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [venueTypes, setVenueTypes] = useState([]);

    const [form, setForm] = useState({
        VenueName: "",
        VenueTypeId: "",
        Description: "",
        Address: "",
        Capacity: "",
        VenueImage: null,
        ExistingVenueImage: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch venue types
                const venueTypesRes = await getVenueTypes();
                setVenueTypes(venueTypesRes.data.data);

                // Fetch venue data
                const venueRes = await getVenueById(id);
                const venue = venueRes.data.data;

                console.log(venue);

                setForm(prev => ({
                    ...prev,
                    VenueName: venue.VenueName || "",
                    VenueTypeId: venue.VenueTypeId || "",
                    Description: venue.Description || "",
                    Address: venue.Address || "",
                    Capacity: venue.Capacity || "",
                    ExistingVenueImage: venue.VenueImage || null,
                }));
            } catch (err) {
                console.error(err);
                setError("Failed to load venue data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleOnChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setForm(prev => ({
                ...prev,
                [name]: files[0],
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new FormData();

            formData.append("_method", "PUT"); // Laravel-safe

            if (form.VenueName) formData.append("VenueName", form.VenueName);
            if (form.VenueTypeId) formData.append("VenueTypeId", form.VenueTypeId);
            if (form.Description) formData.append("Description", form.Description);
            if (form.Address) formData.append("Address", form.Address);
            if (form.Capacity) formData.append("Capacity", form.Capacity);

            if (form.VenueImage) {
                formData.append("VenueImage", form.VenueImage);
            }

            // Log form data for debugging
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const res = await updateVenue(id, formData);
            console.log(res.data);

            // navigate("/admin/venues");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to update venue");
        }
    };

    if (loading) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="mt-6 border border-gray-200 shadow-xl rounded-2xl overflow-hidden bg-white p-8 max-w-4xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">Loading venue data...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="mt-6 border border-gray-200 shadow-xl rounded-2xl overflow-hidden bg-white p-6 md:p-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-100">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Venue</h1>
                        <p className="text-gray-500 mt-2">Update venue information in the system</p>
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

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Venue Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="VenueName" className="block font-medium text-gray-700">
                                Venue Name
                            </label>
                            <input
                                type="text"
                                id="VenueName"
                                name="VenueName"
                                value={form.VenueName}
                                onChange={handleOnChange}
                                placeholder="Enter venue name"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Venue Type Field */}
                        <div className="space-y-2">
                            <label htmlFor="VenueTypeId" className="block font-medium text-gray-700">
                                Venue Type
                            </label>
                            <div className="relative">
                                <select
                                    id="VenueTypeId"
                                    name="VenueTypeId"
                                    value={form.VenueTypeId}
                                    onChange={handleOnChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none cursor-pointer pr-10"
                                >
                                    <option value="">Select venue type</option>
                                    {venueTypes.map(venueType => (
                                        <option
                                            key={venueType.VenueTypeId}
                                            value={venueType.VenueTypeId}
                                            className="py-2"
                                        >
                                            {venueType.VenueTypeName}
                                        </option>
                                    ))}
                                </select>
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
                                name="Address"
                                value={form.Address}
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
                                name="Capacity"
                                value={form.Capacity}
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
                                name="Description"
                                value={form.Description}
                                onChange={handleOnChange}
                                rows="4"
                                placeholder="Enter venue description..."
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Venue Image - Square Selection */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <label className="block font-medium text-gray-700">
                            Venue Image
                        </label>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="w-64 h-48 rounded-xl border-4 border-purple-200 overflow-hidden shadow-md">
                                        <img
                                            src={form.VenueImage
                                                ? URL.createObjectURL(form.VenueImage)
                                                : form.ExistingVenueImage || '/default-venue.jpg'
                                            }
                                            alt="Venue preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

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
                                    Click the camera icon to change image (JPG, PNG, WEBP, max 2MB)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                        <Link
                            to="/admin/venues"
                            className="px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl text-base font-semibold transition-colors shadow-sm hover:shadow-md"
                        >
                            Update Venue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};