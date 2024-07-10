import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FileStorage() {
const [files, setFiles] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [newFile, setNewFile] = useState(null);
const [comment, setComment] = useState('');

useEffect(() => {
    axios.get('/api/files')
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
    axios.delete(`/api/files/${fileId}`)
     .then(response => {
        setFiles(files.filter(file => file.id !== fileId));
     })
     .catch(error => {
        setError(error);
     });
};

const handleRenameFile = (fileId, newName) => {
    axios.put(`/api/files/${fileId}`, { name: newName })
     .then(response => {
        setFiles(files.map(file => file.id === fileId ? response.data : file));
     })
     .catch(error => {
        setError(error);
     });
};

const handleUploadFile = () => {
    const formData = new FormData();
    formData.append('file', newFile);
    formData.append('comment', comment);

    axios.post('/api/files', formData)
     .then(response => {
        setFiles([...files, response.data]);
        setNewFile(null);
        setComment('');
     })
     .catch(error => {
        setError(error);
     });
};

if (loading) return <p>Loading...</p>;
if (error) return <p>Error loading files</p>;

return (
    <div>
     <h1>File Storage</h1>
     <input
        type="file"
        onChange={(e) => setNewFile(e.target.files[0])}
     />
     <input
        type="text"
        placeholder="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
     />
     <button onClick={handleUploadFile}>Upload</button>
     <table>
        <thead>
         <tr>
            <th>Name</th>
            <th>Comment</th>
            <th>Size</th>
            <th>Upload Date</th>
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
                <button onClick={() => handleDeleteFile(file.id)}>Delete</button>
                <button onClick={() => handleRenameFile(file.id, prompt('New name:'))}>Rename</button>
                <button onClick={() => window.open(`/api/files/${file.id}/download`)}>Download</button>
                <button onClick={() => navigator.clipboard.writeText(`/api/files/${file.id}`)}>Copy Link</button>
             </td>
            </tr>
         ))}
        </tbody>
     </table>
    </div>
);
}

export default FileStorage;