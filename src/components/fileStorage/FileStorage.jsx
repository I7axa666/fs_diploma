import { useEffect, useState } from 'react';
import apiPaths from '../../utilits/apiPaths';
import apiClient from '../../utilits/apiClient';

function FileStorage() {
const [files, setFiles] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [newFile, setNewFile] = useState(null);
const [comment, setComment] = useState('');

useEffect(() => {
   apiClient.get(apiPaths.files)
     .then(response => {
        setFiles(response.data);
        setLoading(false);
     })
     .catch(error => {
        setError(error);
        setLoading(false);
     });
}, []);

const handleDeleteFile = (fileId) => {
   apiClient.delete(`${apiPaths.files} + ${fileId}`)
     .then(response => {
        setFiles(files.filter(file => file.id !== fileId));
     })
     .catch(error => {
        setError(error);
     });
};

const handleRenameFile = (fileId, newName) => {
   apiClient.put(`${apiPaths.files} + ${fileId}`, { name: newName })
     .then(response => {
        setFiles(files.map(file => file.id === fileId ? response.data : file));
     })
     .catch(error => {
        setError(error);
     });
};

const handleUploadFile = () => {
   if (!newFile) {
      setError('Пожалуйста, выберите файл для загрузки');
      return;
   }
    const formData = new FormData();
    formData.append('storage_path', newFile);
    formData.append('comment', comment);
    formData.append('original_name', newFile.name);
    formData.append('size', newFile.size);
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
          console.log(`${key}: ${value.name}, ${value.size}, ${value.type}`);
      } else {
          console.log(`${key}: ${value}`);
      }
    }
    apiClient.post(apiPaths.files, formData)
     .then(response => {
        console.log(response.data)
        
        setFiles([...files, response.data]);
        setNewFile(null);
        setComment('');
     })
     .catch(error => {
      console.log(error.response ? error.response.data : error.message);
        setError(error);
     });
};

if (loading) return <p>Загрузка...</p>;
if (error) return <p>Ошибка загрузки</p>;

return (
    <div>
     <h1>Хранилище</h1>
     <input
        type="file"
        onChange={(e) => setNewFile(e.target.files[0])}
     />
     <input
        type="text"
        placeholder="Примечание/описание"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
     />
     <button onClick={handleUploadFile}>Отправить в облако</button>
     <table>
        <thead>
         <tr>
            <th>Название</th>
            <th>Комментарии</th>
            <th>Размер</th>
            <th>Время загрузки</th>
            <th>Last Download Date</th>
            <th>Actions</th>
         </tr>
        </thead>
        <tbody>
         {files.map(file => (
            <tr key={file.id}>
             <td>{file.name}</td>
             <td>{file.comment}</td>
             <td>{file.size}</td>
             <td>{file.uploadDate}</td>
             <td>{file.lastDownloadDate}</td>
             <td>
                <button onClick={() => handleDeleteFile(file.id)}>Удалить</button>
                <button onClick={() => handleRenameFile(file.id, prompt('New name:'))}>Переименовать</button>
                <button onClick={() => window.open(`${apiPaths.files} + ${file.id}/download`)}>Загрузить</button>
                <button onClick={() => navigator.clipboard.writeText(`/api/files/${file.id}`)}>Поделиться</button>
             </td>
            </tr>
         ))}
        </tbody>
     </table>
    </div>
);
}

export default FileStorage;
