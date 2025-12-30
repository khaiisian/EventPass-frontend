import React from 'react'
import {useAuth} from "../auth/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

const UserProfile = () => {
    const {user} = useAuth();
    const navigate = useNavigate();

    const goEditProfile = () => {
        navigate("/editprofile");
    }
    
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-2/7 mx-auto shadow-md rounded-xl border border-gray-200 overflow-hidden">

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-3/6 p-6 md:p-8">
                            <div className="w-35">
                                <label className="mt-3 w-36 h-36 rounded-full bg-gray-200 relative cursor-pointer flex items-center justify-center">
                                    {/* Display selected image or existing user image */}
                                    <img
                                        src={user?.ProfileImg}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="md:w-3/6 p-6 md:p-8 bg-white">
                            <h1 className="text-2xl font-bold text-gray-800 mb-8">Profile Settings</h1>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">User Code</p>
                                    <p className="text-gray-800 font-medium">{user.UserCode}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Name</p>
                                    <p className="text-gray-800 font-medium">{user.UserName}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <p className="text-gray-800 font-medium">{user.Email}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                    <div className="flex items-center">
                                        {user.PhNumber}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <button onClick={goEditProfile} className="w-2/4 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200 cursor-pointer">
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/*<div className="md:w-2/5 p-6 md:p-8 border-r border-gray-200">*/}
                        {/*    <div className="mb-6">*/}
                        {/*        <h2 className="text-lg font-semibold text-gray-800">Your name</h2>*/}
                        {/*        <p className="text-gray-600">yourname@gmail.com</p>*/}
                        {/*    </div>*/}

                        {/*    <form className="space-y-6">*/}
                        {/*        <div>*/}
                        {/*            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">*/}
                        {/*                Name*/}
                        {/*            </label>*/}
                        {/*            <input*/}
                        {/*                type="text"*/}
                        {/*                id="name"*/}
                        {/*                defaultValue="your name"*/}
                        {/*                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"*/}
                        {/*            />*/}
                        {/*        </div>*/}

                        {/*        <div>*/}
                        {/*            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">*/}
                        {/*                Email account*/}
                        {/*            </label>*/}
                        {/*            <input*/}
                        {/*                type="email"*/}
                        {/*                id="email"*/}
                        {/*                defaultValue="yourname@gmail.com"*/}
                        {/*                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"*/}
                        {/*            />*/}
                        {/*        </div>*/}

                        {/*        <div>*/}
                        {/*            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">*/}
                        {/*                Mobile number*/}
                        {/*            </label>*/}
                        {/*            <input*/}
                        {/*                type="tel"*/}
                        {/*                id="mobile"*/}
                        {/*                placeholder="Add number"*/}
                        {/*                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"*/}
                        {/*            />*/}
                        {/*        </div>*/}

                        {/*        <div>*/}
                        {/*            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">*/}
                        {/*                Location*/}
                        {/*            </label>*/}
                        {/*            <input*/}
                        {/*                type="text"*/}
                        {/*                id="location"*/}
                        {/*                defaultValue="USA"*/}
                        {/*                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"*/}
                        {/*            />*/}
                        {/*        </div>*/}

                        {/*        <button*/}
                        {/*            type="submit"*/}
                        {/*            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"*/}
                        {/*        >*/}
                        {/*            Save Change*/}
                        {/*        </button>*/}
                        {/*    </form>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserProfile
