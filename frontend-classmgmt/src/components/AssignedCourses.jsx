import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Avatar,
    CircularProgress,
    Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AssignedCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userProfile } = useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError('');
                
                // Get assigned courses for the class
                const response = await api.get(`/assignments/class/${userProfile.classId}`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setError('Failed to fetch assigned courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (userProfile?.classId) {
            fetchCourses();
        }
    }, [userProfile]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
                Assigned Courses
            </Typography>
            <Grid container spacing={3}>
                {courses.map((assignment) => (
                    <Grid item xs={12} sm={6} md={4} key={assignment._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {assignment.course.code} - {assignment.course.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                    <Avatar 
                                        src={assignment.faculty.photoUrl} 
                                        alt={assignment.faculty.name}
                                        sx={{ mr: 2 }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle1">
                                            {assignment.faculty.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {assignment.faculty.email}
                                        </Typography>
                                    </Box>
                                </Box>
                                {assignment.section && (
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Section: {assignment.section}
                                    </Typography>
                                )}
                                <Typography variant="body2" color="textSecondary">
                                    Credits: {assignment.course.credits}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AssignedCourses; 