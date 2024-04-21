import React, { useState } from 'react';
import axios from 'axios';

const FileUploadComponent = ({ taskId }) => {
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`/api/tenants/{tenantId}/tasks/${taskId}/uploadFile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully.');
    } catch (error) {
      alert('Failed to upload file.');
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
    </div>
  );
};

export default FileUploadComponent;
