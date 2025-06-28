import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../App';
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

const SemesterCourses = () => {
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentSemester } = useAuth();
  const { theme, themeName } = useTheme();
  const navigate = useNavigate();

  const cardBg = themeName === 'dark' ? '#181f2a' : '#fff';
  const cardText = themeName === 'dark' ? '#f1f5f9' : '#1e293b';
  const chipBg = themeName === 'dark' ? '#22304a' : '#e3e8f0';
  const chipText = themeName === 'dark' ? '#60a5fa' : '#2563eb';

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
    <Box p={3} className={`${theme.bg} min-h-screen`}>
      <Typography variant="h5" gutterBottom className={theme.text}>
        Courses for {currentSemester?.name}
      </Typography>

      <Grid container spacing={4}>
        {courseAssignments.map((assignment) => (
          <Grid item xs={12} sm={12} md={6} lg={5} xl={4} key={assignment.id}>
            <Card
              elevation={5}
              className={`rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.015] ${theme.shadow} ${theme.border}`}
              style={{
                background: cardBg,
                color: cardText,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                borderRadius: '20px',
                boxShadow:
                  themeName === 'dark'
                    ? '0px 4px 24px rgba(0,0,0,0.5)'
                    : '0px 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <CardContent>
                {/* Header Row: Code & Credits */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={1}
                  mb={1}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <School fontSize="small" color="primary" />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: cardText,
                        wordBreak: 'break-word'
                      }}
                    >
                      {assignment.code}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${assignment.credits} credits`}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: 13,
                      background: chipBg,
                      color: chipText,
                      height: 24
                    }}
                  />
                </Box>

                {/* Title */}
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    mb: 2,
                    color: cardText,
                    wordBreak: 'break-word'
                  }}
                >
                  {assignment.title}
                </Typography>

                {/* Faculty Info */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar
                    src={assignment.faculty.photoUrl}
                    alt={assignment.faculty.name}
                    sx={{ width: 40, height: 40 }}
                  >
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: cardText }}>
                      {assignment.faculty.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: themeName === 'dark' ? '#a3aed6' : '#64748b' }}
                    >
                      {assignment.faculty.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Date Assigned */}
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Timer fontSize="small" color="action" />
                  <Typography
                    variant="caption"
                    sx={{ color: themeName === 'dark' ? '#a3aed6' : '#64748b' }}
                  >
                    Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                  </Typography>
                </Box>

                {/* Button */}
                <Box mt="auto">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Visibility />}
                    fullWidth
                    onClick={() => handleViewCourse(assignment)}
                    sx={{ borderRadius: 2, fontWeight: 600, py: 1.2 }}
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
