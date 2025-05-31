import React, { useState, useEffect } from 'react';
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
  Alert
} from '@mui/material';
import { School, Person, Timer } from '@mui/icons-material';

const SemesterCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentSemester } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!currentSemester?.id) {
        setError('No semester selected');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/courses/semester/${currentSemester.id}`);
        setCourses(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentSemester]);

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
        {courses.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course.id}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <School color="primary" />
                  <Typography variant="h6" ml={1}>
                    {course.code}
                  </Typography>
                  <Chip 
                    label={`${course.credits} credits`}
                    size="small"
                    color="primary"
                    sx={{ ml: 'auto' }}
                  />
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                  {course.title}
                </Typography>

                <Box display="flex" alignItems="center" mt={2}>
                  <Avatar
                    src={course.faculty.photoUrl}
                    alt={course.faculty.name}
                    sx={{ width: 32, height: 32 }}
                  >
                    <Person />
                  </Avatar>
                  <Box ml={1}>
                    <Typography variant="body2">
                      {course.faculty.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {course.faculty.email}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" mt={1}>
                  <Timer fontSize="small" color="action" />
                  <Typography variant="caption" color="textSecondary" ml={1}>
                    Assigned: {new Date(course.assignedAt).toLocaleDateString()}
                  </Typography>
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