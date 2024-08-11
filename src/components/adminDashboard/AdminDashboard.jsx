import { useEffect, useState } from 'react';
import apiPaths from '../../utilits/apiPaths';
import apiClient from '../../utilits/apiClient';
import './AdminDashboard.css';

function ActionButtons({ userId, is_staff, onToggleAdmin, onDeleteUser }) {
   const [showActions, setShowActions] = useState(false);
   
   const handleToggleActions = () => {
       setShowActions(!showActions);
   };
   
   return (
       <div className="action-buttons">
        <button onClick={handleToggleActions}>Действия</button>
        {showActions && (
           <div className="actions-dropdown">
            <button onClick={() => onToggleAdmin(userId)}>
               {is_staff ? 'Удалить права администратора' : 'Дать права администратора'}
            </button>
            <button onClick={() => onDeleteUser(userId)}>Удалить</button>
           </div>
        )}
       </div>
   );
   }

   function AdminDashboard() {
      const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      
      useEffect(() => {
          apiClient.get(apiPaths.users)
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
          apiClient.delete(`${apiPaths.users}${userId}`)
           .then(response => {
              setUsers(users.filter(user => user.id !== userId));
           })
           .catch(error => {
              setError(error);
           });
      };
      
      const handleToggleAdmin = (userId) => {
          const user = users.find(user => user.id === userId);
          apiClient.put(`${apiPaths.users}${userId}`, { is_staff: !user.is_staff })
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
           <h1>Панель администратора</h1>
           <table>
              <thead>
               <tr>
                  <th>Логин</th>
                  <th>Полное имя</th>
                  <th>Email</th>
                  <th>Статус администратора</th>
                  <th></th>
               </tr>
              </thead>
              <tbody>
               {users.map(user => (
                  <tr key={user.id}>
                   <td>{user.username}</td>
                   <td>{user.fullName}</td>
                   <td>{user.email}</td>
                   <td>{user.is_staff ? 'Да' : 'Нет'}</td>
                   <td>
                      <ActionButtons
                       userId={user.id}
                       is_staff={user.is_staff}
                       onToggleAdmin={handleToggleAdmin}
                       onDeleteUser={handleDeleteUser}
                      />
                   </td>
                  </tr>
               ))}
              </tbody>
           </table>
          </div>
      );
      }

export default AdminDashboard;