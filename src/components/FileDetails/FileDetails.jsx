import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../utilits/apiClient';
import apiPaths from '../../utilits/apiPaths';
import './FileDetails.css';

function FileDetails() {
  const { share_token } = useParams();
  // console.log(`${apiPaths.fileDetails}${share_token}/`)
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient.get(`${apiPaths.fileDetails}${share_token}/`)
    .then(response => {
        setFileData(response.data);
        setLoading(false);
      }
    )
    .catch(error => {
        setError(error.message);
        setLoading(false);    
      }
    );
  }, [share_token]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки данных</p>;

  const getFilePreview = (filePath) => {
    const fileExtension = filePath.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    if (imageExtensions.includes(fileExtension)) {
     return <img src={filePath} alt="File preview" />;
    }

    
    const iconPaths = {
     pdf: '/icons/pdf-icon.png',
     doc: '/icons/doc-icon.png',
     docx: '/icons/doc-icon.png',
     xls: '/icons/xls-icon.png',
     xlsx: '/icons/xls-icon.png',
     ppt: '/icons/ppt-icon.png',
     pptx: '/icons/ppt-icon.png',
     txt: '/icons/txt-icon.png',
     default: '/icons/file-icon.png'
    };

    return <img src={iconPaths[fileExtension] || iconPaths.default} alt="File icon" />;
  };



return (
    <div>
     <header className="site-header">
        <h1>Информация о файле</h1>
     </header>
     <div className="file-details">
        <p><strong>Название:</strong> {fileData.original_name}</p>
        <p><strong>Размер:</strong> {(fileData.size / 1024 / 1024).toFixed(3)} Мб</p>
        <p><strong>Комментарий:</strong> {fileData.comment}</p>
        <p><strong>Дата загрузки:</strong> {fileData.uploadDate}</p>
        <p><strong>Дата последнего скачивания:</strong> {fileData.lastDownloadDate}</p>
     </div>
    </div>
);
}

export default FileDetails;