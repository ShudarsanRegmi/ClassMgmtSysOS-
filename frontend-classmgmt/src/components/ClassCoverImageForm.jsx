import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { PhotoCamera, Delete, CloudUpload } from '@mui/icons-material';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ClassCoverImageForm = ({ onSuccess, onError }) => {
  const { userProfile } = useAuth();
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [currentCoverUrl, setCurrentCoverUrl] = useState('');
  const fileInputRef = useRef();

  // Fetch current cover image on component mount
  React.useEffect(() => {
    if (userProfile?.classId) {
      fetchCurrentCoverImage();
    }
  }, [userProfile?.classId]);

  const fetchCurrentCoverImage = async () => {
    try {
      const response = await api.get(`/class/${userProfile.classId}/details`);
      setCurrentCoverUrl(response.data.photoUrl || '');
    } catch (error) {
      console.error('Error fetching current cover image:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        onError?.('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        onError?.('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !userProfile?.classId) {
      onError?.('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);

      const response = await api.put(`/class/${userProfile.classId}/cover-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setCurrentCoverUrl(response.data.photoUrl);
      setSelectedFile(null);
      setPreviewUrl('');
      fileInputRef.current.value = '';
      onSuccess?.('Class cover image updated successfully!');
    } catch (error) {
      console.error('Error uploading cover image:', error);
      onError?.(error.response?.data?.error || 'Failed to update cover image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    fileInputRef.current.value = '';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Update Class Cover Image
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Cover Image
        </Typography>
        {currentCoverUrl ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar
              src={currentCoverUrl}
              sx={{ width: 120, height: 80, borderRadius: 2 }}
              variant="rounded"
            />
            <Typography variant="body2" color="textSecondary">
              Current class cover image
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            No cover image set
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload New Cover Image
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="cover-image-upload"
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <label htmlFor="cover-image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCamera />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Select Cover Image
            </Button>
          </label>
          
          {selectedFile && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Selected file: {selectedFile.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Avatar
                  src={previewUrl}
                  sx={{ width: 100, height: 60, borderRadius: 1 }}
                  variant="rounded"
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleRemoveFile}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!selectedFile || uploading}
          onClick={handleUpload}
          startIcon={uploading ? <CircularProgress size={18} /> : <CloudUpload />}
        >
          {uploading ? 'Uploading...' : 'Update Cover Image'}
        </Button>

        <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
          Supported formats: JPG, PNG, GIF. Maximum size: 5MB
        </Typography>
      </Paper>
    </Box>
  );
};

export default ClassCoverImageForm; 