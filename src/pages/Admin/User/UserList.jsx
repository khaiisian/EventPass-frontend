import React, {useEffect} from 'react'
import {getUsers, deleteUser} from "../../../api/userService.js.jsx";
import {Link} from "react-router-dom";

const UserList = () => {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchUsers = async () => {
        try{
            const response = await getUsers();
            setUsers(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if(!confirm('Are you sure you want to delete this user?')) {
            return;
        }
        try{
            await deleteUser(id);
            fetchUsers();
        } catch (error) {
            console.log(error);
        }
    }

    if(loading){
        return <div>Loading...</div>;
    }

    return (
        <div className="px-10">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900">
                    User Management
                </h1>
                <Link
                    to="/admin/users/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-lg font-semibold transition"
                >
                    + Add User
                </Link>
            </div>

            {/* Table with dark header */}
            <div className="border border-gray-200 shadow-2xl rounded-xl overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-800 text-gray-100 uppercase tracking-wider text-xs">
                    <tr>
                        <th className="text-base px-6 py-4 text-left rounded-tl-lg">User Code</th>
                        <th className="text-base px-6 py-4 text-left">Name</th>
                        <th className="text-base px-6 py-4 text-left">Email</th>
                        <th className="text-base px-6 py-4 text-left">Phone Number</th>
                        <th className="text-base px-6 py-4 text-left">Role</th>
                        <th className="text-base px-6 py-4 text-left rounded-tr-lg">Actions</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                    {users.map(user => (
                        <tr
                            key={user.UserId}
                            className="hover:bg-purple-50/50 transition"
                        >
                            <td className="text-base px-6 py-4 font-medium text-gray-900">
                                {user.UserCode}
                            </td>
                            <td className="text-base px-6 py-4 font-medium text-gray-900">
                                {user.UserName}
                            </td>
                            <td className="text-base px-6 py-4 text-gray-600">
                                {user.Email}
                            </td>
                            <td className="text-base px-6 py-4 text-gray-600">
                                {user.PhNumber}
                            </td>
                            <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold
                                bg-purple-100 text-purple-700 border border-purple-200">
                                {user.Role}
                            </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="grid grid-cols-2 gap-3 w-2/3">
                                    <Link
                                        to={`/admin/users/${user.UserId}/edit`}
                                        className="bg-cyan-600 text-white px-3 py-1 rounded-lg text-base font-semibold hover:bg-cyan-800 transition text-center"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(user.UserId)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-base font-semibold hover:bg-red-700 transition text-center"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default UserList
