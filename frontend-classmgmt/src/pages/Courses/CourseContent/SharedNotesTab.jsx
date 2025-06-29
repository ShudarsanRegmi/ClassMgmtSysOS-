import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  ThumbUp,
  ThumbUpOutlined,
  Delete as DeleteIcon,
  Download,
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const SharedNotesTab = ({ notes = [], courseId, semesterId, onNoteUpdate }) => {
  const { user, userRole, classId, userId } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    sharedBy: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Log notes prop whenever it changes
  useEffect(() => {
    console.log('Notes prop received:', notes);
  }, [notes]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log('Fetching students from:', `/class/${classId}/students`);
        const response = await api.get(`/class/${classId}/students`);
        console.log('Students API Response:', response.data);
        
        // Extract only the required fields from students array
        const processedStudents = response.data.students.map(student => ({
          _id: student._id,
          name: student.name,
          photoUrl: student.photoUrl,
          email: student.email,
          rollNo: student.rollNo
        }));
        
        console.log('Processed students:', processedStudents);
        setStudents(processedStudents);
        // Set default sharedBy to current user
        setFormData(prev => ({
          ...prev,
          sharedBy: userId
        }));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    if (classId) {
      fetchStudents();
    }
  }, [classId, userId]);

  const handleClickOpen = () => {
    setOpen(true);
    // Reset form data without setting default sharedBy
    setFormData({
      title: '',
      description: '',
      tags: '',
      sharedBy: '', // Always empty by default to force selection
    });
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      tags: '',
      sharedBy: '', // Always empty by default to force selection
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
      
      // Process tags: split, trim, and filter empty tags
      const tagsArray = formData.tags
        ? formData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
        : [];
      
      formDataToSend.append('tags', JSON.stringify(tagsArray));
      formDataToSend.append('sharedBy', formData.sharedBy || userId);

      console.log('Submitting note with formData:', {
        title: formData.title,
        description: formData.description,
        tags: tagsArray,
        sharedBy: formData.sharedBy || userId
      });

      const response = await api.post(
        `/courses/${courseId}/materials/${semesterId}/note`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Note upload API Response:', response.data);

      if (onNoteUpdate) {
        // Find the student details for sharedBy
        const sharedByStudent = students.find(s => s._id === (response.data.data.sharedBy?._id || response.data.data.sharedBy));
        console.log('Found sharedBy student:', sharedByStudent);
        
        // Ensure the response data has the correct format before updating
        const newNote = {
          ...response.data.data,
          tags: Array.isArray(response.data.data.tags) 
            ? response.data.data.tags 
            : response.data.data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
          sharedBy: sharedByStudent || response.data.data.sharedBy,
          uploadedAt: response.data.data.uploadedAt || new Date().toISOString()
        };
        console.log('Processed new note:', newNote);
        console.log('Current notes before update:', notes);
        onNoteUpdate([...(notes || []), newNote]);
      }
      
      setFormData({
        title: '',
        description: '',
        tags: '',
        sharedBy: userId
      });
      setSelectedFile(null);
      
      alert('Note shared successfully! You can share another or close the dialog.');
    } catch (error) {
      console.error('Error sharing note:', error);
      alert('Error sharing note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (noteId) => {
    try {
      const response = await api.post(`/courses/${courseId}/materials/${semesterId}/note/${noteId}/like`);
      console.log('Like response:', response.data);

      const updatedNotes = notes.map(note => {
        if (note._id === noteId) {
          // Get the current user's like status
          const userLiked = note.likes?.some(like => like._id === userId);
          
          // Update likes array based on current state
          const updatedLikes = userLiked
            ? (note.likes || []).filter(like => like._id !== userId)
            : [...(note.likes || []), { _id: userId }];

          return {
            ...note,
            likes: updatedLikes
          };
        }
        return note;
      });

      onNoteUpdate(updatedNotes);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/courses/${courseId}/materials/${semesterId}/note/${noteId}`);
      onNoteUpdate(notes.filter(note => note._id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note. Please try again.');
    }
  };

  const getStudentLabel = (studentId) => {
    const student = students.find(s => s._id === studentId);
    if (!student) return '';
    return student._id === userId ? 'You' : student.name;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Shared Notes ({notes?.length || 0})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          disabled={loading}
        >
          Share Note
        </Button>
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(notes) && notes.map((note) => (
          <Grid item xs={12} md={6} key={note._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" gutterBottom>
                    {note.title}
                  </Typography>
                  <Box>
                    {(() => {
                      let tagsArray = [];
                      if (Array.isArray(note.tags)) {
                        // Handle array format (possibly stringified)
                        tagsArray = note.tags.map(tag => 
                          typeof tag === 'string' ? tag.replace(/[\[\]"]/g, '').trim() : tag
                        );
                      } else if (typeof note.tags === 'string') {
                        // Handle comma-separated string
                        tagsArray = note.tags.split(',').map(tag => tag.trim());
                      }
                      return tagsArray.filter(Boolean).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ));
                    })()}
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {note.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={note.sharedBy?.photoUrl || note.uploadedBy?.photoUrl}
                      alt={note.sharedBy?.name || note.uploadedBy?.name || 'User'}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Shared by {note.sharedBy?._id === userId ? 'You' : note.sharedBy?.name || note.uploadedBy?.name || 'Unknown User'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(note.uploadedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleLike(note._id)}
                      color={note.likes?.some(like => like._id === userId) ? 'primary' : 'default'}
                    >
                      {note.likes?.some(like => like._id === userId) ? <ThumbUp /> : <ThumbUpOutlined />}
                    </IconButton>
                    <Typography variant="caption" sx={{ mx: 1 }}>
                      {note.likes?.length || 0}
                    </Typography>
                    <IconButton
                      size="small"
                      href={note.fileUrl}
                      target="_blank"
                      download
                    >
                      <Download />
                    </IconButton>
                    {(userRole === 'FACULTY' || userRole === 'CA' || note.sharedBy?._id === userId || note.uploadedBy?._id === userId) && (
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

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        disableEscapeKeyDown={loading}
      >
        <DialogTitle>Share Note</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
              disabled={loading}
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
            />
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              margin="normal"
              placeholder="e.g. chapter1, important, exam"
              disabled={loading}
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
              sx={{ mt: 2, width: '100%' }}
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
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected file: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Close</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading || !formData.title || !selectedFile || !formData.sharedBy}
          >
            {loading ? 'Sharing...' : 'Share'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SharedNotesTab; 