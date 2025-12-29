import React, { useState, useEffect } from 'react';
import { useAuth } from "../auth/AuthContext.jsx";
import api from "../api/axios.js";

const EditProfile = () => {
    const { user, fetchUser, updateUserInfo } = useAuth();

    const [userInfoForm, setUserInfoForm] = useState({
        UserName: "",
        Email: "",
        PhNumber: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        Password: "",
        CurrentPassword: "",
        Password_confirmation: "",
    });

    const [userInfoLoading, setUserInfoLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [userInfoError, setUserInfoError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const [userInfoSuccess, setUserInfoSuccess] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);

    useEffect(() => {
        if (user) {
            setUserInfoForm({
                UserName: user.UserName,
                Email: user.Email,
                PhNumber: user.PhNumber,
            });
        }
    }, [user]);

    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfoForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUserInfoSubmit = async (e) => {
        e.preventDefault();
        setUserInfoLoading(true);
        setUserInfoError(null);
        setUserInfoSuccess(null);

        try {
            const res = await api.put(`/users/${user.UserId}`, userInfoForm);

            if (!res.data.status) {
                setUserInfoError(res.data.message || "Update Failed.");
                return;
            }

            if (res.data.data) {
                updateUserInfo(res.data.data);  // This updates immediately
            }
            setUserInfoSuccess(res.data.message);

            setTimeout(() => setUserInfoSuccess(null), 4000);

        } catch (err) {
            setUserInfoError(err.response?.data?.message || "Update Failed.");
        } finally {
            setUserInfoLoading(false);
        }
    };

    const handleUserPasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError(null);
        setPasswordSuccess(null);

        try {
            const res = await api.put('/users/updatePassword', passwordForm);

            if (!res.data.status) {
                setPasswordError(res.data.message || "Update Failed.");
                return;
            }

            await fetchUser();
            setPasswordForm({ Password: "", CurrentPassword: "", Password_confirmation: "" });
            setPasswordSuccess(res.data.message);

            setTimeout(() => setPasswordSuccess(null), 4000);

        } catch (err) {
            setPasswordError(err.response?.data?.message || "Update Failed.");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Edit Profile</h1>
                </div>

                <section className="bg-white shadow rounded-lg p-6">
                    <header className="mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                        <p className="text-sm text-gray-600 mt-1">Update your account's profile information and email address.</p>
                    </header>

                    {userInfoError && <div className="text-red-600 mb-4">{userInfoError}</div>}
                    {userInfoSuccess && <div className="text-green-600 mb-4">{userInfoSuccess}</div>}

                    <form className="space-y-5" onSubmit={handleUserInfoSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="UserName"
                                value={userInfoForm.UserName}
                                onChange={handleUserInfoChange}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="Email"
                                value={userInfoForm.Email}
                                onChange={handleUserInfoChange}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                name="PhNumber"
                                value={userInfoForm.PhNumber}
                                onChange={handleUserInfoChange}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={userInfoLoading}
                                className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-700 transition"
                            >
                                {userInfoLoading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="bg-white shadow rounded-lg p-6">
                    <header className="mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
                        <p className="text-sm text-gray-600 mt-1">Ensure your account is using a long, random password.</p>
                    </header>

                    {passwordError && <div className="text-red-600 mb-4">{passwordError}</div>}
                    {passwordSuccess && <div className="text-green-600 mb-4">{passwordSuccess}</div>}

                    <form className="space-y-5" onSubmit={handleUserPasswordSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Current Password</label>
                            <input
                                type="password"
                                name="CurrentPassword"
                                value={passwordForm.CurrentPassword}
                                onChange={handlePasswordChange}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                name="Password"
                                value={passwordForm.Password}
                                onChange={handlePasswordChange}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                name="Password_confirmation"
                                value={passwordForm.Password_confirmation}
                                onChange={handlePasswordChange}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-700 transition"
                            >
                                {passwordLoading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="bg-white shadow rounded-lg p-6">
                    <header className="mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Delete Account</h2>
                        <p className="text-sm text-gray-600 mt-1">Once your account is deleted, all of its data will be permanently removed.</p>
                    </header>

                    <button
                        type="button"
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                        Delete Account
                    </button>
                </section>
            </div>
        </div>
    );
};

export default EditProfile;
