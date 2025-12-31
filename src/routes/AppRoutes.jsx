import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';
import MainLayout from '../Components/Layouts/MainLayout';
import UserProfile from '../pages/UserProfile';
import EditProfile from '../pages/EditProfile';
import {useAuth} from "../auth/AuthContext.jsx";
import AdminLayout from "../Components/Layouts/AdminLayout.jsx";
import UserList from "../pages/Admin/User/UserList.jsx";
import {CreateUser} from "../pages/Admin/User/CreateUser.jsx";
import EditUser from "../pages/Admin/User/EditUser.jsx";

const ProtectedRoute = ({ children }) => {
    const { user, loadingUser } = useAuth();

    if (loadingUser) return <div>Loading...</div>; // wait for fetchUser

    return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
    const { user, loadingUser } = useAuth();

    if (loadingUser) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    if (user.Role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

    return children;
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

                <Route element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }>
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/users" element={<UserList />} />
                    <Route path="/admin/users/create" element={<CreateUser />} />
                    <Route path="/admin/users/:id/edit" element={<EditUser />} />

                </Route>


                <Route path="/login" element={<Login />} />
            </Routes>
    );
}
