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
  IconButton,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  ThumbUp,
  ThumbUpOutlined,
  Download,
  Delete as DeleteIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const SharedNotesTab = ({ notes = [], courseId, semesterId, onNoteUpdate }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      tags: ''
    });
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('tags', formData.tags.split(',').map(tag => tag.trim()));

      const response = await api.post(
        `/courses/${courseId}/materials/${semesterId}/note`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (onNoteUpdate) {
        onNoteUpdate([...notes, response.data.data]);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error uploading note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/courses/${courseId}/materials/${semesterId}/note/${noteId}`);
      if (onNoteUpdate) {
        onNoteUpdate(notes.filter(n => n._id !== noteId));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleLike = async (noteId) => {
    try {
      const response = await api.post(
        `/courses/${courseId}/materials/${semesterId}/notes/${noteId}/like`
      );
      
      if (onNoteUpdate) {
        onNoteUpdate(
          notes.map(note => 
            note._id === noteId ? response.data.data : note
          )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const isLiked = (note) => note.likes.some(like => like._id === user.uid);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Shared Notes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Share Notes
        </Button>
      </Box>

      <Grid container spacing={3}>
        {notes.map((note) => (
          <Grid item xs={12} md={6} key={note._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={note.uploadedBy?.photoUrl}
                      alt={note.uploadedBy?.name}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                    <Box>
                      <Typography variant="subtitle1">
                        {note.title}
                        {note.isVerified && (
                          <VerifiedIcon
                            color="primary"
                            sx={{ ml: 1, width: 16, height: 16 }}
                          />
                        )}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        by {note.uploadedBy?.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {note.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>

                <Typography color="textSecondary" sx={{ mt: 2, mb: 2 }}>
                  {note.description}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <IconButton
                      size="small"
                      onClick={() => handleLike(note._id)}
                      color={isLiked(note) ? 'primary' : 'default'}
                    >
                      {isLiked(note) ? <ThumbUp /> : <ThumbUpOutlined />}
                    </IconButton>
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {note.likes.length} likes
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      href={note.fileUrl}
                      target="_blank"
                      download
                    >
                      <Download />
                    </IconButton>
                    {(user.uid === note.uploadedBy?._id || user.role === 'FACULTY' || user.role === 'CA') && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(note._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Share Notes</DialogTitle>
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
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              margin="normal"
              placeholder="e.g., unit1, important, exam"
            />
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 2, width: '100%' }}
            >
              Upload Notes
              <input
                type="file"
                hidden
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
            {loading ? 'Sharing...' : 'Share'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SharedNotesTab; 