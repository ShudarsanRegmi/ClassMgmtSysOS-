import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, ZoomIn as ZoomInIcon } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const SyllabusTab = ({ syllabus, courseId, semesterId, onSyllabusUpdate }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ title: '', description: '' });
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      alert('Please select an image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);

      const response = await api.post(
        `/courses/${courseId}/materials/${semesterId}/syllabus`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (onSyllabusUpdate) {
        onSyllabusUpdate(response.data.data);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error uploading syllabus:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Course Syllabus</Typography>
        {!syllabus && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Upload Syllabus
          </Button>
        )}
      </Box>

      {syllabus ? (
        <Card>
          <Box position="relative">
            <CardMedia
              component="img"
              image={syllabus.fileUrl}
              alt="Course Syllabus"
              sx={{
                maxHeight: '70vh',
                objectFit: 'contain',
                cursor: 'pointer'
              }}
              onClick={() => setPreviewOpen(true)}
            />
            <IconButton
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
              onClick={() => setPreviewOpen(true)}
            >
              <ZoomInIcon />
            </IconButton>
          </Box>
        </Card>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          bgcolor="grey.100"
          borderRadius={1}
        >
          <Typography color="textSecondary">
            No syllabus has been uploaded yet
          </Typography>
        </Box>
      )}

      {/* Upload Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Syllabus</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 2, width: '100%' }}
            >
              Upload Syllabus Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {selectedFile && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected file: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading || !formData.title || !selectedFile}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent>
          <img
            src={syllabus?.fileUrl}
            alt="Course Syllabus"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button
            variant="contained"
            href={syllabus?.fileUrl}
            target="_blank"
            download
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SyllabusTab; 