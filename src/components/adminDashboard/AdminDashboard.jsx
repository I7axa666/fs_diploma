import { useEffect, useState } from 'react';
import apiPaths from '../../utilits/apiPaths';
import apiClient from '../../utilits/apiClient';
import FileStorage from '../fileStorage/FileStorage';
import './AdminDashboard.css';

function ActionButtons({ userId, is_staff, onToggleAdmin, onDeleteUser, onGetFiles }) {
   const [showActions, setShowActions] = useState(false);
   
   const handleToggleActions = () => {
       setShowActions(!showActions);
   };

   const handleAction = (action) => {
      action();
      setShowActions(false);
  };
   
   return (
       <div className="action-buttons">
        <button onClick={handleToggleActions}>Действия</button>
        {showActions && (
           <div className="actions-dropdown">
               <button onClick={() => handleAction(() => onToggleAdmin(userId))}>
            {is_staff ? 'Удалить права администратора' : 'Дать права администратора'}
         </button>
         <button onClick={() => handleAction(() => onDeleteUser(userId))}>Удалить</button>
         <button onClick={() => handleAction(() => onGetFiles(userId))}>Показать файлы</button>
           </div>
        )}
       </div>
   );
   }

   function AdminDashboard() {
      const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [selectedUserFiles, setSelectedUserFiles] = useState([]);
      
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
          apiClient.put(`${apiPaths.users}${userId}/`, { is_staff: !user.is_staff })
           .then(response => {
              setUsers(users.map(user => user.id === userId ? response.data : user));
           })
           .catch(error => {
              setError(error);
           });
      };

      const handleGetFiles = (userId) => {
          setSelectedUserFiles([]);
          apiClient.get(`${apiPaths.userFiles}?user_id=${userId}`)
           .then(response => {
              setSelectedUserFiles(response.data);
           })
           .catch(error => {
              setError(error);
           });
      };
      
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Ошибка загрузки пользователей</p>;
      
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
                       onGetFiles={handleGetFiles}
                      />
                   </td>
                  </tr>
               ))}
              </tbody>
           </table>
           {selectedUserFiles.length > 0 && (
               <div>
               <h2>Файлы пользователя</h2>
               <FileStorage files={selectedUserFiles} />
        </div>
     )}
          </div>
      );
      }

export default AdminDashboard;

