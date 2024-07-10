import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    axios.get('/api/users')
     .then(response => {
        setUsers(response.data);
        setLoading(false);
     })
     .catch(error => {
        setError(error);
        setLoading(false);
     });
}, []);

const handleDeleteUser = (userId) => {
    axios.delete(`/api/users/${userId}`)
     .then(response => {
        setUsers(users.filter(user => user.id !== userId));
     })
     .catch(error => {
        setError(error);
     });
};

const handleToggleAdmin = (userId) => {
    const user = users.find(user => user.id === userId);
    axios.put(`/api/users/${userId}`, { isAdmin: !user.isAdmin })
     .then(response => {
        setUsers(users.map(user => user.id === userId ? response.data : user));
     })
     .catch(error => {
        setError(error);
     });
};

if (loading) return <p>Loading...</p>;
if (error) return <p>Error loading users</p>;

return (
    <div>
     <h1>Admin Dashboard</h1>
     <table>
        <thead>
         <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Actions</th>
         </tr>
        </thead>
        <tbody>
         {users.map(user => (
            <tr key={user.id}>
             <td>{user.username}</td>
             <td>{user.fullName}</td>
             <td>{user.email}</td>
             <td>{user.isAdmin ? 'Yes' : 'No'}</td>
             <td>
                <button onClick={() => handleToggleAdmin(user.id)}>
                 {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                </button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
             </td>
            </tr>
         ))}
        </tbody>
     </table>
    </div>
);
}

export default AdminDashboard;