import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { School, Person, Timer, Visibility } from '@mui/icons-material';

// Used in Dashboard to list the courses for the particular semester 

const SemesterCourses = () => {
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentSemester } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseAssignments = async () => {
      if (!currentSemester?.id) {
        setError('No semester selected');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/courses/semester/${currentSemester.id}`);
        setCourseAssignments(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAssignments();
  }, [currentSemester]);

  const handleViewCourse = (courseAssignment) => {
    navigate(`/courses/${courseAssignment.courseId}/semester/${currentSemester.id}`, {
      state: { 
        assignmentId: courseAssignment.id,
        facultyName: courseAssignment.faculty.name
      }
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Courses for {currentSemester?.name}
      </Typography>
      
      <Grid container spacing={3}>
        {courseAssignments.map((assignment) => (
          <Grid item xs={12} md={6} lg={4} key={assignment.id}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <School color="primary" />
                  <Typography variant="h6" ml={1}>
                    {assignment.code}
                  </Typography>
                  <Chip 
                    label={`${assignment.credits} credits`}
                    size="small"
                    color="primary"
                    sx={{ ml: 'auto' }}
                  />
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                  {assignment.title}
                </Typography>

                <Box display="flex" alignItems="center" mt={2}>
                  <Avatar
                    src={assignment.faculty.photoUrl}
                    alt={assignment.faculty.name}
                    sx={{ width: 32, height: 32 }}
                  >
                    <Person />
                  </Avatar>
                  <Box ml={1}>
                    <Typography variant="body2">
                      {assignment.faculty.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {assignment.faculty.email}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" mt={1}>
                  <Timer fontSize="small" color="action" />
                  <Typography variant="caption" color="textSecondary" ml={1}>
                    Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Visibility />}
                    fullWidth
                    onClick={() => handleViewCourse(assignment)}
                  >
                    View Course
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SemesterCourses; 