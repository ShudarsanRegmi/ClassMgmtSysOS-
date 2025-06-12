import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import api from '../utils/api';

const WhiteboardShotForm = ({ courseId, semesterId, classId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    lectureDate: dayjs(),
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      setError('Some files were skipped as they are not images');
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
      setError('');
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('topic', formData.topic);
      formDataToSend.append('lectureDate', formData.lectureDate.toISOString());
      
      // Log the form data being sent
      console.group('📤 Whiteboard Shot Upload');
      console.log('Course ID:', courseId);
      console.log('Semester ID:', semesterId);
      console.log('Class ID:', classId);
      console.log('Form Data:', {
        title: formData.title,
        topic: formData.topic,
        lectureDate: formData.lectureDate.toISOString(),
        filesCount: selectedFiles.length
      });
      console.groupEnd();

      // Append all files
      selectedFiles.forEach((file, index) => {
        formDataToSend.append('files', file);
      });

      const response = await api.post(
        `/courses/${courseId}/materials/${semesterId}/whiteboard`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (onSuccess) {
        onSuccess(response.data.data);
      }
      
      // Reset form
      setFormData({
        title: '',
        topic: '',
        lectureDate: dayjs(),
      });
      setSelectedFiles([]);
      setError('');
    } catch (error) {
      console.error('Error uploading whiteboard shot:', error);
      setError('Error uploading whiteboard shot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        margin="normal"
        required
        disabled={loading}
        error={!formData.title && error}
        helperText={!formData.title && error ? 'Title is required' : ''}
      />
      
      <TextField
        fullWidth
        label="Topic"
        value={formData.topic}
        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
        margin="normal"
        required
        disabled={loading}
        error={!formData.topic && error}
        helperText={!formData.topic && error ? 'Topic is required' : ''}
      />
      
      <DatePicker
        label="Lecture Date"
        value={formData.lectureDate}
        onChange={(newValue) => setFormData({ ...formData, lectureDate: newValue })}
        sx={{ mt: 2, width: '100%' }}
        disabled={loading}
        format="DD/MM/YYYY"
        slotProps={{
          textField: {
            required: true,
            margin: "normal"
          }
        }}
      />

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          startIcon={<CloudUploadIcon />}
          disabled={loading}
        >
          Add Images
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
        </Button>
      </Box>

      {selectedFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Files ({selectedFiles.length}):
          </Typography>
          <Grid container spacing={1}>
            {selectedFiles.map((file, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
                >
                  <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                    {file.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => removeFile(index)}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !formData.title || !formData.topic || selectedFiles.length === 0}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outlined"
            disabled={loading}
            fullWidth
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default WhiteboardShotForm; 