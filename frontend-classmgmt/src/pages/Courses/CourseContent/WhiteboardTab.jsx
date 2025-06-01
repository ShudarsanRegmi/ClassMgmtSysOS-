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
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  ZoomIn as ZoomInIcon,
  Delete as DeleteIcon,
  Download
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const WhiteboardTab = ({ shots = [], courseId, semesterId, onShotUpdate }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    lectureDate: new Date(),
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      topic: '',
      lectureDate: new Date(),
    });
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
      formDataToSend.append('topic', formData.topic);
      formDataToSend.append('lectureDate', formData.lectureDate.toISOString());

      const response = await api.post(
        `/courses/${courseId}/materials/${semesterId}/whiteboard`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (onShotUpdate) {
        onShotUpdate([...shots, response.data.data]);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error uploading whiteboard shot:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shotId) => {
    if (!window.confirm('Are you sure you want to delete this whiteboard shot?')) return;

    try {
      await api.delete(`/courses/${courseId}/materials/${semesterId}/whiteboard/${shotId}`);
      if (onShotUpdate) {
        onShotUpdate(shots.filter(s => s._id !== shotId));
      }
    } catch (error) {
      console.error('Error deleting whiteboard shot:', error);
    }
  };

  const handlePreview = (shot) => {
    setPreviewImage(shot);
    setPreviewOpen(true);
  };

  // Group shots by date
  const groupedShots = shots.reduce((groups, shot) => {
    const date = new Date(shot.lectureDate).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(shot);
    return groups;
  }, {});

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Whiteboard Shots</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Shot
        </Button>
      </Box>

      {Object.entries(groupedShots)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, dateShots]) => (
          <Box key={date} mb={4}>
            <Typography variant="h6" gutterBottom>
              {date}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              {dateShots.map((shot) => (
                <Grid item xs={12} sm={6} md={4} key={shot._id}>
                  <Card>
                    <Box position="relative">
                      <CardMedia
                        component="img"
                        height="200"
                        image={shot.fileUrl}
                        alt={shot.title}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handlePreview(shot)}
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
                        onClick={() => handlePreview(shot)}
                      >
                        <ZoomInIcon />
                      </IconButton>
                    </Box>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {shot.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Topic: {shot.topic}
                      </Typography>
                      <Box display="flex" justifyContent="flex-end" mt={1}>
                        <IconButton
                          size="small"
                          href={shot.fileUrl}
                          target="_blank"
                          download
                        >
                          <Download />
                        </IconButton>
                        {(user.role === 'FACULTY' || user.role === 'CA') && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(shot._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Whiteboard Shot</DialogTitle>
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
              label="Topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              margin="normal"
              required
            />
            <DatePicker
              label="Lecture Date"
              value={formData.lectureDate}
              onChange={(newValue) => setFormData({ ...formData, lectureDate: newValue })}
              sx={{ mt: 2, width: '100%' }}
            />
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 2, width: '100%' }}
            >
              Upload Image
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
            disabled={loading || !formData.title || !formData.topic || !selectedFile}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent>
          <img
            src={previewImage?.fileUrl}
            alt={previewImage?.title}
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
            href={previewImage?.fileUrl}
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

export default WhiteboardTab; 