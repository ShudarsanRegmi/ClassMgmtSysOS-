// /client/components/FileUploader.js
import React, { useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

function FileUploader() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const token = await user.getIdToken();

    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post('http://localhost:3001/api/files/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Uploaded File:', res.data);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUploader;
