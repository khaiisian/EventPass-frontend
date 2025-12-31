import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../../api/userService.js.jsx";

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        UserName: "",
        Email: "",
        PhNumber: "",
        Role: "CUSTOMER",
        Password: "",
        Password_confirmation: "",
        ProfileImg: null,
        ExistingProfileImg: null,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserById(id);
                const user = res.data.data;

                console.log(user);

                setForm(prev => ({
                    ...prev,
                    UserName: user.UserName,
                    Email: user.Email,
                    PhNumber: user.PhNumber,
                    Role: user.Role,
                    ExistingProfileImg: user.ProfileImg,
                }));
            } catch (err) {
                console.error(err);
                setError("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
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

        if (
            form.Password &&
            form.Password !== form.Password_confirmation
        ) {
            setError("Passwords do not match");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("_method", "PUT"); // Laravel-safe
            formData.append("UserName", form.UserName);
            formData.append("Email", form.Email);
            formData.append("PhNumber", form.PhNumber);
            formData.append("Role", form.Role);

            if (form.Password) {
                formData.append("Password", form.Password);
                formData.append(
                    "Password_confirmation",
                    form.Password_confirmation
                );
            }

            if (form.ProfileImg) {
                formData.append("ProfileImg", form.ProfileImg);
            }

            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const res = await updateUser(id, formData);
            console.log(res.data);


            navigate("/admin/users");
        } catch (err) {
            console.error(err);
            setError("Failed to update user");
        }
    };


    if (loading) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="mt-6 border border-gray-200 shadow-xl rounded-2xl overflow-hidden bg-white p-8 max-w-4xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">Loading user data...</div>
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
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit User</h1>
                        <p className="text-gray-500 mt-2">Update user information in the system</p>
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

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="UserName" className="block font-medium text-gray-700">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="UserName"
                                name="UserName"
                                value={form.UserName}
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
                                name="Email"
                                value={form.Email}
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
                                name="PhNumber"
                                value={form.PhNumber}
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
                                value={form.Role}
                                onChange={handleOnChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors bg-white"
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="ADMIN">Administrator</option>
                            </select>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="Password" className="block font-medium text-gray-700">
                                New Password (optional)
                            </label>
                            <input
                                type="password"
                                id="Password"
                                name="Password"
                                value={form.Password}
                                onChange={handleOnChange}
                                placeholder="Leave blank to keep current password"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="Password_confirmation" className="block font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="Password_confirmation"
                                name="Password_confirmation"
                                value={form.Password_confirmation}
                                onChange={handleOnChange}
                                placeholder="Confirm new password"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Profile Image - Circular Selection */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <label className="block font-medium text-gray-700">
                            Profile Image
                        </label>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-purple-200 overflow-hidden shadow-md">
                                        <img
                                            src={form.ProfileImg
                                                ? URL.createObjectURL(form.ProfileImg)
                                                : form.ExistingProfileImg || '/default-avatar.png'
                                            }
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

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
                                    Click the camera icon to change
                                </span>
                            </div>
                        </div>
                    </div>

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
                            Update User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;