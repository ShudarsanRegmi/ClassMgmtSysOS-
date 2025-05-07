// /client/components/FileUploader.js
import React, { useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

function FileUploader() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file before uploading.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus('Uploading...');

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

      setUploadStatus('File uploaded successfully!');
      console.log('Uploaded File:', res.data);
      setFile(null); // Reset file input
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-xl max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 text-center">Upload Your File</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full mb-4 text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />

      <button
        onClick={handleUpload}
        disabled={isUploading}
        className={`w-full py-2 px-4 rounded-lg text-white transition duration-200 ${
          isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadStatus && (
        <div className="mt-4 text-center text-sm text-gray-700">
          {uploadStatus}
        </div>
      )}
    </div>
  );
}

export default FileUploader;
