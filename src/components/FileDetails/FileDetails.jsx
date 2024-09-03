import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../utilits/apiClient';
import apiPaths from '../../utilits/apiPaths';
import './FileDetails.css';

import pdfIcon from '../../icons/pdf-icon.png';
import docIcon from '../../icons/doc-icon.png';
import xlsIcon from '../../icons/xls-icon.png';
import pptIcon from '../../icons/ppt-icon.png';
import txtIcon from '../../icons/txt-icon.png';
import defaultIcon from '../../icons/file-icon.png';


function FileDetails() {
  const { share_token } = useParams();
  console.log(`${apiPaths.fileDetails}${share_token}/`)
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient.get(`${apiPaths.fileDetails}${share_token}/`)
    .then(response => {
        setFileData(response.data);
        // console.log(fileData);
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
  if (error) return <p>Неверная ссылка или доступ к файлу ограничен</p>;

  const getFilePreview = (filePath) => {
    const fileExtension = filePath.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    if (imageExtensions.includes(fileExtension)) {
     return <img src={filePath} alt="File preview" />;
    }

    
    const iconPaths = {
     pdf: pdfIcon,
     doc: docIcon,
     docx: docIcon,
     xls: xlsIcon,
     xlsx: xlsIcon,
     ppt: pptIcon,
     pptx: pptIcon,
     txt: txtIcon,
     default: defaultIcon
    };

    return <img src={iconPaths[fileExtension] || iconPaths.default} alt="File icon" />;
  };

  const handleDownload = () => {
    fetch(fileData.storage_path, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileData.original_name);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    })
    .catch(error => console.error('Ошибка скачивания файла:', error));
  };

return (
  <div>
    <header className="site-header">
      <h1>Информация о файле</h1>
    </header>
    {fileData && (
      <div className="file-details">
        <div className="file-preview">
          {getFilePreview(fileData.storage_path)}
        </div>
        <div className="file-info">
          <p><strong>Название:</strong> {fileData.original_name}</p>
          <p><strong>Размер:</strong> {(fileData.size / 1024 / 1024).toFixed(3)} Мб</p>
          {fileData.comment && <p><strong>Комментарий:</strong> {fileData.comment}</p>}
          <button className="download-button" onClick={handleDownload}>Скачать файл</button>
        </div>
      </div>
    )}
  </div>
);
}

export default FileDetails;
