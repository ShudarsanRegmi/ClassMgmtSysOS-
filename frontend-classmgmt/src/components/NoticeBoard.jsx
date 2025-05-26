import React, { useState, useEffect } from 'react';
import { getNotices, deleteNotice } from '../services/noticeService';
import { 
    Box, 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Pagination, 
    Chip, 
    IconButton,
    Alert,
    Snackbar
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { 
        currentUser,
        userProfile,
        userId,
        userName
    } = useAuth();

    useEffect(() => {
        console.log('Auth State:', {
            userId,
            userName,
            userProfile
        });
    }, [userId, userName, userProfile]);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getNotices(page);
            console.log('Fetched notices:', data.notices);
            setNotices(data.notices);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching notices:', error);
            setError('Failed to load notices. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            try {
                setError(null);
                await deleteNotice(id);
                fetchNotices();
            } catch (error) {
                console.error('Error deleting notice:', error);
                if (error.response?.status === 403) {
                    setError('You do not have permission to delete this notice.');
                } else {
                    setError('Failed to delete notice. Please try again later.');
                }
            }
        }
    };

    const handleCloseError = () => {
        setError(null);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'success';
            default:
                return 'default';
        }
    };

    const checkPermissions = (notice) => {
        // Check if user is the author of the notice
        const isAuthor = notice.author === userId;
        
        // Log permission check details
        console.log('Permission check:', {
            noticeId: notice._id,
            noticeAuthor: notice.author,
            userId,
            isAuthor
        });

        return isAuthor;
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Loading notices...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Notice Board
                </Typography>
                {currentUser && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/notices/create')}
                    >
                        Create Notice
                    </Button>
                )}
            </Box>

            {notices.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="textSecondary">
                        No notices available
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {notices.map((notice) => {
                        const canEdit = checkPermissions(notice);
                        console.log(`Notice ${notice._id} can be edited:`, canEdit);
                        
                        return (
                            <Grid item xs={12} key={notice._id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box>
                                                <Typography variant="h6" component="h2">
                                                    {notice.title}
                                                </Typography>
                                                <Typography color="textSecondary" gutterBottom>
                                                    Posted by {notice.authorName || 'Unknown'} on {new Date(notice.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Chip
                                                    label={notice.priority}
                                                    color={getPriorityColor(notice.priority)}
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                />
                                                <Chip
                                                    label={notice.targetAudience}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </Box>
                                        </Box>
                                        
                                        <Typography variant="body1" sx={{ mt: 2 }}>
                                            {notice.content}
                                        </Typography>

                                        {canEdit && (
                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => navigate(`/notices/edit/${notice._id}`)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(notice._id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {totalPages > 1 && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
};

export default NoticeBoard; 