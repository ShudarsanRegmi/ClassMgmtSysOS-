import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Paper,
  Card,
  CardContent,
  Fade,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import { PhotoCamera, Delete, EmojiEvents } from '@mui/icons-material';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const RankBadge = ({ rank }) => {
  const theme = useTheme();
  
  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return theme.palette.warning.main;
      case 2:
        return theme.palette.grey[400];
      case 3:
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderRadius: 1,
        bgcolor: alpha(getRankColor(rank), 0.1),
        color: getRankColor(rank),
        border: `1px solid ${alpha(getRankColor(rank), 0.3)}`,
      }}
    >
      <EmojiEvents />
      <Typography variant="subtitle1" fontWeight="bold">
        {rank === 1 ? '1st Rank' : rank === 2 ? '2nd Rank' : '3rd Rank'}
      </Typography>
    </Box>
  );
};

const HonorForm = ({ onSuccess, onError }) => {
  const { userProfile, currentSemester } = useAuth();
  const theme = useTheme();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [rank, setRank] = useState('');
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [userProfile?.classId]);

  useEffect(() => {
    if (selectedStudent) {
      const student = students.find(s => s._id === selectedStudent);
      setSelectedStudentDetails(student);
    } else {
      setSelectedStudentDetails(null);
    }
  }, [selectedStudent, students]);

  const fetchStudents = async () => {
    try {
      const response = await api.get(`/class/${userProfile.classId}/students`);
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
      onError?.('Failed to fetch students');
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate required fields
    if (!selectedStudent) {
      onError?.('Please select a student');
      return;
    }
    if (!rank) {
      onError?.('Please select a rank');
      return;
    }
    if (!currentSemester?.id) {
      onError?.('No active semester found');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('studentId', selectedStudent);
      formData.append('rank', rank);
      formData.append('semesterId', currentSemester.id);
      formData.append('classId', userProfile.classId);
      if (photo) {
        formData.append('photo', photo);
      }

      await api.post('/honors', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onSuccess?.();
      resetForm();
    } catch (error) {
      console.error('Error creating honor entry:', error);
      onError?.(error.response?.data?.message || 'Failed to create honor entry');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedStudent('');
    setRank('');
    setPhoto(null);
    setPreviewUrl('');
    setSelectedStudentDetails(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)} 30%, ${alpha(theme.palette.primary.light, 0.1)} 90%)`,
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
            Add Rank Holder
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
                    Student Information
                  </Typography>
                  
                  <FormControl fullWidth required sx={{ mb: 3 }}>
                    <InputLabel>Select Student</InputLabel>
                    <Select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      label="Select Student"
                    >
                      {students.map((student) => (
                        <MenuItem key={student._id} value={student._id}>
                          {student.name} ({student.rollNo})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedStudentDetails && (
                    <Fade in={true}>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Selected Student Details:
                        </Typography>
                        <Box sx={{ mt: 1, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
                          <Typography variant="body2">
                            Name: {selectedStudentDetails.name}
                          </Typography>
                          <Typography variant="body2">
                            Roll No: {selectedStudentDetails.rollNo}
                          </Typography>
                        </Box>
                      </Box>
                    </Fade>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
                    Rank & Photo
                  </Typography>

                  <FormControl fullWidth required sx={{ mb: 3 }}>
                    <InputLabel>Select Rank</InputLabel>
                    <Select
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      label="Select Rank"
                    >
                      <MenuItem value={1}>1st Rank</MenuItem>
                      <MenuItem value={2}>2nd Rank</MenuItem>
                      <MenuItem value={3}>3rd Rank</MenuItem>
                    </Select>
                  </FormControl>

                  {rank && (
                    <Fade in={true}>
                      <Box sx={{ mb: 3 }}>
                        <RankBadge rank={rank} />
                      </Box>
                    </Fade>
                  )}

                  <Box sx={{ mt: 3 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="photo-upload"
                      type="file"
                      onChange={handlePhotoChange}
                    />
                    <label htmlFor="photo-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCamera />}
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        Upload Photo
                      </Button>
                    </label>
                    
                    {previewUrl && (
                      <Fade in={true}>
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                          <Avatar
                            src={previewUrl}
                            sx={{ 
                              width: 120, 
                              height: 120,
                              border: `4px solid ${theme.palette.primary.main}`,
                              boxShadow: 3
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: 'background.paper',
                              boxShadow: 2,
                              '&:hover': {
                                bgcolor: 'error.light',
                                color: 'white'
                              }
                            }}
                            onClick={() => {
                              setPhoto(null);
                              setPreviewUrl('');
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Fade>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem'
                }}
              >
                {loading ? 'Saving...' : 'Save Rank Holder'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default HonorForm; 