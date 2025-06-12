import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TimetableForm = ({ onSubmitSuccess, onError }) => {
  const { currentSemester, classId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateScheduleFormat = (schedule) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const requiredFields = ['time', 'course_name'];

    // Check if all required days are present
    const hasAllDays = days.every(day => schedule.hasOwnProperty(day));
    if (!hasAllDays) {
      throw new Error('Schedule must include all weekdays (Monday through Saturday)');
    }

    // Check each day's schedule
    days.forEach(day => {
      if (!Array.isArray(schedule[day])) {
        throw new Error(`${day}'s schedule must be an array`);
      }

      schedule[day].forEach((slot, index) => {
        // Check required fields
        requiredFields.forEach(field => {
          if (!slot.hasOwnProperty(field)) {
            throw new Error(`Time slot ${index + 1} on ${day} is missing required field: ${field}`);
          }
        });

        // Validate time format
        if (!/^\d{2}:\d{2}–\d{2}:\d{2}$/.test(slot.time)) {
          throw new Error(`Invalid time format in ${day}, slot ${index + 1}. Expected format: HH:MM–HH:MM`);
        }
      });
    });

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    try {
      // Parse and validate JSON
      const schedule = JSON.parse(jsonInput);
      validateScheduleFormat(schedule);

      setLoading(true);
      const response = await api.post('/timetable/update', {
        classId: classId,
        semesterId: currentSemester.id,
        schedule
      });

      if (onSubmitSuccess) {
        onSubmitSuccess(response.data.data);
      }

      // Clear form
      setJsonInput('');
    } catch (error) {
      console.error('Error submitting timetable:', error);
      if (error instanceof SyntaxError) {
        setValidationError('Invalid JSON format');
      } else {
        setValidationError(error.message);
        onError?.({
          message: error.response?.data?.message || error.message || 'Failed to update timetable'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Paste your timetable JSON below. The JSON should include schedules for all weekdays (Monday through Saturday).
      </Typography>
      
      {validationError && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {validationError}
        </Alert>
      )}

      <TextField
        fullWidth
        multiline
        rows={20}
        label="Timetable JSON"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        margin="normal"
        required
        error={!!validationError}
        sx={{
          fontFamily: 'monospace',
          '& .MuiInputBase-input': {
            fontFamily: 'monospace',
          },
        }}
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !jsonInput.trim()}
        >
          {loading ? 'Updating...' : 'Update Timetable'}
        </Button>
      </Box>
    </Box>
  );
};

export default TimetableForm; 