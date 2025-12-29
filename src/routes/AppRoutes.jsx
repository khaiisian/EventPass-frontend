import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';
import MainLayout from '../Components/Layouts/MainLayout';
import UserProfile from '../pages/UserProfile';
import EditProfile from '../pages/EditProfile';
import {useAuth} from "../auth/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
    const { user, loadingUser } = useAuth();

    if (loadingUser) return <div>Loading...</div>; // wait for fetchUser

    return user ? children : <Navigate to="/login" replace />;
};


export default function AppRoutes() {
    return (
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} /> {/* <-- redirect root */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <UserProfile />
                        </ProtectedRoute>
                    }/>

                    <Route path="/editprofile" element={
                        <ProtectedRoute>
                            <EditProfile />
                        </ProtectedRoute>
                    }/>
                </Route>
            </Routes>
    );
}
