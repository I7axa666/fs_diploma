import { useEffect, useState } from 'react';
import apiPaths from '../../utilits/apiPaths';
import apiClient from '../../utilits/apiClient';
import './FileStorage.css';

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
   // console.log(`${apiPaths.files} ${fileId}/`);
   apiClient.delete(`${apiPaths.files} ${fileId}/`)
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
   
    apiClient.post(apiPaths.files, formData)
     .then(response => {
        
        setFiles([...files, response.data]);
        setNewFile(null);
        setComment('');
     })
     .catch(error => {
      console.log(error.response ? error.response.data : error.message);
        setError(error);
     });
};

const handleShareFile = (file_id) => {
   navigator.clipboard.writeText(`${apiPaths.files}${file_id}`)
   console.log(`${apiPaths.files}${file_id}`)
}

if (loading) return <p>Загрузка...</p>;
if (error) return <p>Ошибка загрузки</p>;

return (
    <div>
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
            <th>Размер</th>
            {/* <th>Комментарии</th>
            <th>Время загрузки</th>
            <th>Last Download Date</th> */}
            <th></th>
         </tr>
        </thead>
        <tbody>
         {files.map(file => (
            <tr key={file.id}>
             <td>{file.original_name}</td>
             <td>{(file.size / 1024 / 1024).toFixed(3)}  Мб</td>
             {/* <td>{file.comment}</td>
             <td>{file.uploadDate}</td>
             <td>{file.lastDownloadDate}</td> */}
             <td>
               <div className="dropdown">
               <button className="dropbtn">Действия</button>
               <div className="dropdown-content">
                     <button onClick={() => handleDeleteFile(file.id)}>Удалить</button>
                     <button onClick={() => handleRenameFile(file.id, prompt('Новое имя:'))}>Переименовать</button>
                     <button onClick={() => window.open(`${apiPaths.files} + ${file.id}/download`)}>Загрузить</button>
                     <button onClick={() => handleShareFile(file.id)}>Поделиться</button>
                  </div>
               </div>
             </td>
            </tr>
         ))}
        </tbody>
     </table>
    </div>
);
}

export default FileStorage;
