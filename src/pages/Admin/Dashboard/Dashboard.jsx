import { useAuth } from "../../../auth/AuthContext.jsx";

export default function Dashboard() {
    const { user, logout } = useAuth(); // get user from context

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">
                Welcome, {user?.UserName || 'User'}!
            </h1>
            <p className="mb-6 text-gray-700">{user?.Email}</p>

            <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
}
