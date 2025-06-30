import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  MenuItem,
  Autocomplete,
  Typography,
} from '@mui/material';
import { Share } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const ShareNoteDialog = ({ open, onClose, courseId, semesterId, onNoteUpdate }) => {
  const { user } = useAuth();
  const userId = user?._id;
  const userRole = user?.role;

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    sharedBy: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch students for the dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get(`/students?courseId=${courseId}&semesterId=${semesterId}`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    if (open && courseId && semesterId) {
      fetchStudents();
    }
  }, [open, courseId, semesterId]);

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      tags: '',
      sharedBy: '',
    });
    setSelectedFile(null);
    setLoading(false);
    onClose();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !selectedFile || !formData.sharedBy) {
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('tags', formData.tags);
    formDataToSend.append('sharedBy', formData.sharedBy);
    formDataToSend.append('file', selectedFile);
    formDataToSend.append('courseId', courseId);
    formDataToSend.append('semesterId', semesterId);

    try {
      const response = await api.post('/api/course-materials/shared-notes', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          tags: '',
          sharedBy: '',
        });
        setSelectedFile(null);
        
        // Notify parent component
        if (onNoteUpdate) {
          onNoteUpdate();
        }
        
        handleClose();
      }
    } catch (error) {
      console.error('Error sharing note:', error);
      alert('Failed to share note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown={loading}
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px 12px 0 0'
      }}>
        <Box display="flex" alignItems="center">
          <Share sx={{ mr: 1 }} />
          Share Note
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box component="form" noValidate>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.8)',
              }
            }}
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.8)',
              }
            }}
          />
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            margin="normal"
            placeholder="e.g. chapter1, important, exam"
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.8)',
              }
            }}
          />
          <Autocomplete
            fullWidth
            options={students}
            getOptionLabel={(option) => option._id === userId ? 'You' : option.name}
            value={students.find(s => s._id === formData.sharedBy) || null}
            onChange={(event, newValue) => {
              setFormData(prev => ({
                ...prev,
                sharedBy: newValue?._id || ''
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Shared By"
                margin="normal"
                required
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                  }
                }}
              />
            )}
            renderOption={(props, option) => (
              <MenuItem {...props} key={option._id}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={option.photoUrl}
                    alt={option.name}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  <Typography>
                    {option._id === userId ? 'You' : option.name}
                  </Typography>
                </Box>
              </MenuItem>
            )}
            disabled={loading}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ 
              mt: 2, 
              width: '100%',
              borderRadius: 2,
              borderColor: 'rgba(102, 126, 234, 0.3)',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(102, 126, 234, 0.05)',
              }
            }}
            disabled={loading}
          >
            {selectedFile ? 'Change File' : 'Upload Note'}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              disabled={loading}
            />
          </Button>
          {selectedFile && (
            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'success.main' }}>
              ✓ Selected file: {selectedFile.name}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.05)',
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.title || !selectedFile || !formData.sharedBy}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            px: 3,
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              background: 'rgba(0,0,0,0.12)',
              transform: 'none',
            }
          }}
        >
          {loading ? 'Sharing...' : 'Share Note'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareNoteDialog; 