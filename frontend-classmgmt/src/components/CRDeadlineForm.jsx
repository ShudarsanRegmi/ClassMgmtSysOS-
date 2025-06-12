import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const DEADLINE_TYPES = ['ASSIGNMENT', 'PROJECT', 'QUIZ', 'EXAM', 'OTHER'];

const CRDeadlineForm = ({ onSubmitSuccess, onError }) => {
  const { user, currentSemester } = useAuth();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ASSIGNMENT',
    dueDate: dayjs(new Date()),
    fileUrl: null,
    courseId: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/courses/semester/${currentSemester.id}`);
        setCourses(response.data.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        onError?.({ message: 'Failed to fetch courses' });
      }
    };

    if (currentSemester?.id) {
      fetchCourses();
    }
  }, [currentSemester, onError]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseId) {
      onError?.({ message: 'Please select a course' });
      return;
    }
    
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
        `/courses/${formData.courseId}/materials/${currentSemester.id}/deadline`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (onSubmitSuccess) {
        onSubmitSuccess(response.data.data);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'ASSIGNMENT',
        dueDate: dayjs(new Date()),
        fileUrl: null,
        courseId: ''
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error creating deadline:', error);
      onError?.({ 
        message: error.response?.data?.message || 'Failed to create deadline'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Course</InputLabel>
        <Select
          value={formData.courseId}
          label="Course"
          onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
          required
        >
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.courseId}>
              {course.code} - {course.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          type="submit"
          variant="contained" 
          disabled={loading || !formData.title || !formData.dueDate || !formData.courseId}
        >
          {loading ? 'Creating...' : 'Create Deadline'}
        </Button>
      </Box>
    </Box>
  );
};

export default CRDeadlineForm; 