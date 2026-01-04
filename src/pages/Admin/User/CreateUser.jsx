import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from "../../../api/userService.js";

export const CreateUser = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        UserName: "",
        Email: "",
        PhNumber: "",
        Password: "",
        Password_confirmation: "",
        ProfileImg: null,
        Role: "CUSTOMER",
    });

    const handleSubmit = async (e) => {
        setError(null);
        e.preventDefault();

        const formData = new FormData();
        for (const key in form) {
            if (key === "ProfileImg" && form[key] instanceof File) {
                formData.append(key, form[key]);
            } else if (form[key] !== null && form[key] !== undefined) {
                formData.append(key, form[key]);
            }
        }

        try {
            await createUser(formData);
            navigate("/admin/users");
        } catch (err) {
            console.error(err.response?.data);
            setError(err.response?.data?.message || "Error creating user");
        }
    };

    const handleOnChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "ProfileImg") {
            setForm((prev) => ({ ...prev, ProfileImg: files[0] || null }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="mt-6 border border-gray-200 shadow-xl rounded-2xl overflow-hidden bg-white p-6 md:p-8 max-w-4xl mx-auto">
                {/* Header - Improved spacing and alignment */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-100">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New User</h1>
                        <p className="text-gray-500 mt-2">Add a new user to the system</p>
                    </div>
                    <Link
                        to="/admin/users"
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-base font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to List
                    </Link>
                </div>

                {/* Form - Improved grid and spacing */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && <div className="text-red-600 mb-4">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="UserName" className="block font-medium text-gray-700">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="UserName"
                                value={form.UserName}
                                name="UserName"
                                onChange={handleOnChange}
                                required
                                placeholder="Enter full name"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="Email" className="block font-medium text-gray-700">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="Email"
                                value={form.Email}
                                name="Email"
                                onChange={handleOnChange}
                                required
                                placeholder="user@example.com"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Phone Number Field */}
                        <div className="space-y-2">
                            <label htmlFor="PhNumber" className="block font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="PhNumber"
                                value={form.PhNumber}
                                name="PhNumber"
                                onChange={handleOnChange}
                                placeholder="+1 (555) 123-4567"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Role Field */}
                        <div className="space-y-2">
                            <label htmlFor="Role" className="block font-medium text-gray-700">
                                User Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="Role"
                                name="Role"
                                onChange={handleOnChange}
                                value={form.Role}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors bg-white"
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="ADMIN">Administrator</option>
                            </select>
                        </div>

                            <div className="space-y-2">
                            <label htmlFor="Password" className="block font-medium text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="Password"
                                value={form.Password}
                                name="Password"
                                onChange={handleOnChange}
                                required
                                placeholder="••••••••"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="Password_confirmation" className="block font-medium text-gray-700">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="Password_confirmation"
                                value={form.Password_confirmation}
                                name="Password_confirmation"
                                onChange={handleOnChange}
                                required
                                placeholder="••••••••"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <label className="block font-medium text-gray-700">
                            Profile Image
                        </label>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                            {/* Circular Preview/Upload Area */}
                            <div className="flex flex-col items-center gap-4">
                                {/* Circular Container */}
                                <div className="relative">
                                    {form.ProfileImg ? (
                                        <div className="w-32 h-32 rounded-full border-4 border-purple-200 overflow-hidden shadow-md">
                                            <img
                                                src={typeof form.ProfileImg === 'string'
                                                    ? form.ProfileImg
                                                    : URL.createObjectURL(form.ProfileImg)}
                                                alt="Profile preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <label
                                        htmlFor="ProfileImg"
                                        className="absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <input
                                            type="file"
                                            id="ProfileImg"
                                            name="ProfileImg"
                                            onChange={handleOnChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <span className="text-sm text-gray-500">
                            Click the camera icon to upload
                        </span>
                            </div>

                        </div>
                    </div>

                    {/*<div className="space-y-2 pt-4 border-t border-gray-100">*/}
                    {/*    <label htmlFor="ProfileImg" className="block font-medium text-gray-700">*/}
                    {/*        Profile Image*/}
                    {/*    </label>*/}
                    {/*    <div className="flex items-center gap-4">*/}
                    {/*        <input*/}
                    {/*            type="file"*/}
                    {/*            id="ProfileImg"*/}
                    {/*            name="ProfileImg"*/}
                    {/*            onChange={handleOnChange}*/}
                    {/*            accept="image/*"*/}
                    {/*            className="w-full border border-gray-300 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 file:font-medium hover:file:bg-purple-100 transition-colors"*/}
                    {/*        />*/}
                    {/*        {form.ProfileImg && (*/}
                    {/*            <div className="w-16 h-16 rounded-full border-2 border-purple-200 overflow-hidden">*/}
                    {/*                <img*/}
                    {/*                    src={URL.createObjectURL(form.ProfileImg)}*/}
                    {/*                    alt="Preview"*/}
                    {/*                    className="w-full h-full object-cover"*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*    </div>*/}
                    {/*    <p className="text-sm text-gray-500 mt-2">Upload a profile picture (optional)</p>*/}
                    {/*</div>*/}

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                        <Link
                            to="/admin/users"
                            className="px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl text-base font-semibold transition-colors shadow-sm hover:shadow-md"
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
