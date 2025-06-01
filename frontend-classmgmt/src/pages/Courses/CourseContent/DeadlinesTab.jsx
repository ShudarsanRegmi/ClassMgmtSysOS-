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
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const DEADLINE_TYPES = ['ASSIGNMENT', 'PROJECT', 'QUIZ', 'EXAM', 'OTHER'];

const DeadlinesTab = ({ deadlines = [], courseId, semesterId, onDeadlineUpdate }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ASSIGNMENT',
    dueDate: dayjs(new Date()),
    fileUrl: null
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      type: 'ASSIGNMENT',
      dueDate: dayjs(new Date()),
      fileUrl: null
    });
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('dueDate', formData.dueDate.toISOString());

      const response = await api.post(
        `/courses/${courseId}/materials/${semesterId}/deadline`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (onDeadlineUpdate) {
        onDeadlineUpdate([...(deadlines || []), response.data.data]);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error creating deadline:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (deadline) => {
    const now = dayjs();
    const dueDate = dayjs(deadline.dueDate);
    
    if (now.isAfter(dueDate)) return 'error';
    if (now.add(1, 'day').isAfter(dueDate)) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Deadlines</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Deadline
        </Button>
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(deadlines) && deadlines.map((deadline) => (
          <Grid item xs={12} md={6} key={deadline._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" gutterBottom>
                    {deadline.title}
                  </Typography>
                  <Box>
                    <Chip
                      label={deadline.type}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={dayjs(deadline.dueDate).format('MMM D, YYYY h:mm A')}
                      color={getStatusColor(deadline)}
                      size="small"
                    />
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {deadline.description}
                </Typography>
                {deadline.fileUrl && (
                  <Button
                    variant="outlined"
                    size="small"
                    href={deadline.fileUrl}
                    target="_blank"
                    sx={{ mt: 1 }}
                  >
                    View Attachment
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Deadline</DialogTitle>
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
              select
              fullWidth
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              margin="normal"
            >
              {DEADLINE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <DateTimePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
              sx={{ mt: 2, width: '100%' }}
            />
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 2, width: '100%' }}
            >
              Upload Attachment
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
            disabled={loading || !formData.title || !formData.dueDate}
          >
            {loading ? 'Adding...' : 'Add Deadline'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeadlinesTab; 