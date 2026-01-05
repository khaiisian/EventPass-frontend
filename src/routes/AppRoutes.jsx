import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from "../auth/AuthContext.jsx";

import MainLayout from "../Components/Layouts/MainLayout.jsx";
import AdminLayout from "../Components/Layouts/AdminLayout.jsx";

import Login from '../pages/Auth/Login.jsx';
import Register from '../pages/Auth/Register.jsx';
import Dashboard from '../pages/Admin/Dashboard/Dashboard.jsx';
import UserProfile from '../pages/Customer/Profile/UserProfile.jsx';
import EditProfile from '../pages/Customer/Profile/EditProfile.jsx';

import UserList from "../pages/Admin/User/UserList.jsx";
import { CreateUser } from "../pages/Admin/User/CreateUser.jsx";
import EditUser from "../pages/Admin/User/EditUser.jsx";
import { VenueTypeList } from "../pages/Admin/VenueType/VenueTypeList.jsx";
import { CreateVenueType } from "../pages/Admin/VenueType/CreateVenueType.jsx";
import { EditVenueType } from "../pages/Admin/VenueType/EditVenueType.jsx";
import VenueList from "../pages/Admin/Venue/VenueList.jsx";
import { CreateVenue } from "../pages/Admin/Venue/CreateVenue.jsx";
import { EditVenue } from "../pages/Admin/Venue/EditVenue.jsx";
import { EventTypeList } from "../pages/Admin/EventType/EventTypeList.jsx";
import { CreateEventType } from "../pages/Admin/EventType/CreateEventType.jsx";
import { EditEventType } from "../pages/Admin/EventType/EditEventType.jsx";
import { EventList } from "../pages/Admin/Event/EventList.jsx";
import { CreateEvent } from "../pages/Admin/Event/CreateEvent.jsx";
import { EditEvent } from "../pages/Admin/Event/EditEvent.jsx";
import { OrganizerList } from "../pages/Admin/Organizer/OrganizerList.jsx";
import { CreateOrganizer } from "../pages/Admin/Organizer/CreateOrganizer.jsx";
import { EditOrganizer } from "../pages/Admin/Organizer/EditOrganizer.jsx";
import {HomePage} from "../pages/Customer/HomePage/HomePage.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loadingUser } = useAuth();
    if (loadingUser) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.Role)) {
        return <Navigate to={user.Role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />;
    }
    return children;
};

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']}><MainLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/editprofile" element={<EditProfile />} />
                <Route path="/homepage" element={<HomePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
                <Route path="/admin/dashboard" element={<Dashboard />} />

                <Route path="/admin/users" element={<UserList />} />
                <Route path="/admin/users/create" element={<CreateUser />} />
                <Route path="/admin/users/:id/edit" element={<EditUser />} />

                <Route path="/admin/venuetypes" element={<VenueTypeList />} />
                <Route path="/admin/venuetypes/create" element={<CreateVenueType />} />
                <Route path="/admin/venuetypes/:id/edit" element={<EditVenueType />} />

                <Route path="/admin/venues" element={<VenueList />} />
                <Route path="/admin/venues/create" element={<CreateVenue />} />
                <Route path="/admin/venues/:id/edit" element={<EditVenue />} />

                <Route path="/admin/eventtypes" element={<EventTypeList />} />
                <Route path="/admin/eventtypes/create" element={<CreateEventType />} />
                <Route path="/admin/eventtypes/:id/edit" element={<EditEventType />} />

                <Route path="/admin/events" element={<EventList />} />
                <Route path="/admin/events/create" element={<CreateEvent />} />
                <Route path="/admin/events/:id/edit" element={<EditEvent />} />

                <Route path="/admin/organizers" element={<OrganizerList />} />
                <Route path="/admin/organizers/create" element={<CreateOrganizer />} />
                <Route path="/admin/organizers/:id/edit" element={<EditOrganizer />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
