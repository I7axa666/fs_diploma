import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import apiPaths from '../../utilits/apiPaths';
import apiClient from '../../utilits/apiClient';
import { clearFiles, setFiles } from '../../actions/authActions';
import './FileStorage.css';

function FileStorage() {
   const dispatch = useDispatch();
   const files = useSelector((state) => state.files);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [newFile, setNewFile] = useState(null);
   const [comment, setComment] = useState('');
   
   useEffect(() => {
       apiClient.get(apiPaths.files)
        .then(response => {
           dispatch(setFiles(response.data));
           setLoading(false);
        })
        .catch(error => {
           setError(error);
           setLoading(false);
        });
   
       return () => {
        dispatch(clearFiles());
       };
   }, [dispatch]);
   
   const handleDeleteFile = (fileId) => {
       apiClient.delete(`${apiPaths.files}${fileId}/`)
        .then(response => {
           dispatch(setFiles(files.filter(file => file.id !== fileId)));
        })
        .catch(error => {
           setError(error);
        });
   };
   
   const handleRenameFile = (fileId, currentName) => {
       const newName = prompt('Новое имя:', currentName);
       if (!newName || newName === currentName) return;
   
       apiClient.post(`${apiPaths.files}${fileId}/rename/`, { new_name: newName })
        .then(response => {
           if (response.data.status === "File renamed successfully") {
            dispatch(setFiles(files.map(file => file.id === fileId ? { ...file, original_name: newName } : file)));
           }
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
           dispatch(setFiles([...files, response.data]));
           setNewFile(null);
           setComment('');
        })
        .catch(error => {
           console.log(error.response ? error.response.data : error.message);
           setError(error);
        });
   };
   
   const handleDownload = (storage_path, name) => {
       fetch(`${storage_path}`, {
        method: 'GET',
        headers: {
           'Content-Type': 'application/octet-stream',
        },
       })
        .then(response => response.blob())
        .then(blob => {
           const url = window.URL.createObjectURL(blob);
           const link = document.createElement('a');
           link.href = url;
           link.setAttribute('download', name);
           document.body.appendChild(link);
           link.click();
           link.parentNode.removeChild(link);
        })
        .catch(error => console.error('Ошибка скачивания файла:', error));
   };
   
   const handleShareFile = (file_id, share_link) => {
       if (share_link) {
        apiClient.post(`${apiPaths.files}${file_id}/revoke/`)
           .then(response => {
            dispatch(setFiles(files.map(file => file.id === file_id ? { ...file, download_link: null } : file)));
           })
           .catch(error => {
            setError(error);
           });
       } else {
        apiClient.post(`${apiPaths.files}${file_id}/share/`)
           .then(response => {
            share_link = response.data.download_link;
            dispatch(setFiles(files.map(file => file.id === file_id ? { ...file, download_link: share_link } : file)));
           })
           .catch(error => {
            setError(error);
           });
       }
   };
   
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
               <th>Комментарии</th>
               <th>Ссылка для общего доступа</th>
               <th></th>
            </tr>
           </thead>
           <tbody>
            {files.map(file => (
               <tr key={file.id}>
                <td>{file.original_name}</td>
                <td>{(file.size / 1024 / 1024).toFixed(3)} Мб</td>
                <td>{file.comment}</td>
                <td>{file.download_link}</td>
                <td>
                   <div className="dropdown">
                    <button className="dropbtn">Действия</button>
                    <div className="dropdown-content">
                       <button onClick={() => handleDeleteFile(file.id)}>Удалить</button>
                       <button onClick={() => handleRenameFile(file.id, file.original_name)}>Переименовать</button>
                       <button onClick={() => handleDownload(file.storage_path, file.original_name)}>Загрузить</button>
                       <button onClick={() => handleShareFile(file.id, file.download_link)}>
                        {file.download_link ? 'Закрыть доступ' : 'Поделиться'}
                       </button>
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