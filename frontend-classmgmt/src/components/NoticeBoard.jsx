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
    Snackbar,
    Paper,
    Divider,
    Avatar,
    useTheme
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
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
    const theme = useTheme();

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
        const isAuthor = notice.author === userId;
        
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
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '200px',
                p: 3
            }}>
                <Typography variant="body1" color="text.secondary">
                    Loading notices...
                </Typography>
            </Box>
        );
    }

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 4, 
                borderRadius: 4,
                background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(180deg, rgba(30,30,30,0.8) 0%, rgba(45,45,45,0.8) 100%)' 
                    : 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.9) 100%)',
                backdropFilter: 'blur(8px)',
                border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.12)' 
                    : '1px solid rgba(0, 0, 0, 0.12)'
            }}
        >
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseError} 
                    severity="error" 
                    sx={{ 
                        width: '100%',
                        boxShadow: theme.shadows[4]
                    }}
                >
                    {error}
                </Alert>
            </Snackbar>

            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ 
                        bgcolor: theme.palette.primary.main,
                        width: 56, 
                        height: 56
                    }}>
                        <NotificationsIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h4" component="h1" sx={{ 
                        fontWeight: 700,
                        background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(90deg, #ffffff, #bbbbbb)'
                            : 'linear-gradient(90deg, #1976d2, #5e92f3)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Notice Board
                    </Typography>
                </Box>
                {currentUser && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/notices/create')}
                        sx={{
                            borderRadius: 20,
                            px: 4,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: theme.shadows[2],
                            '&:hover': {
                                boxShadow: theme.shadows[4]
                            }
                        }}
                    >
                        Create Notice
                    </Button>
                )}
            </Box>

            {notices.length === 0 ? (
                <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 4,
                    background: theme.palette.background.paper
                }}>
                    <Typography variant="h6" color="textSecondary">
                        No notices available
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Be the first to create one!
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {notices.map((notice) => {
                        const canEdit = checkPermissions(notice);
                        console.log(`Notice ${notice._id} can be edited:`, canEdit);
                        
                        return (
                            <Grid item xs={12} key={notice._id}>
                                <Card sx={{
                                    borderRadius: 3,
                                    boxShadow: theme.shadows[2],
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: theme.shadows[6]
                                    },
                                    background: theme.palette.background.paper
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'flex-start',
                                            mb: 2
                                        }}>
                                            <Box>
                                                <Typography variant="h5" component="h2" sx={{ 
                                                    fontWeight: 600,
                                                    mb: 1
                                                }}>
                                                    {notice.title}
                                                </Typography>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    mb: 1
                                                }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Posted by {notice.authorName || 'Unknown'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        • {new Date(notice.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Chip
                                                    label={notice.priority}
                                                    color={getPriorityColor(notice.priority)}
                                                    size="small"
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        textTransform: 'capitalize'
                                                    }}
                                                />
                                                <Chip
                                                    label={notice.targetAudience}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 500,
                                                        textTransform: 'capitalize'
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                        
                                        <Divider sx={{ my: 2 }} />
                                        
                                        <Typography variant="body1" sx={{ 
                                            mt: 2,
                                            lineHeight: 1.6,
                                            color: theme.palette.text.primary
                                        }}>
                                            {notice.content}
                                        </Typography>

                                        {canEdit && (
                                            <Box sx={{ 
                                                mt: 3, 
                                                display: 'flex', 
                                                justifyContent: 'flex-end',
                                                gap: 1
                                            }}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => navigate(`/notices/edit/${notice._id}`)}
                                                    sx={{
                                                        borderRadius: 20,
                                                        px: 2,
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => handleDelete(notice._id)}
                                                    sx={{
                                                        borderRadius: 20,
                                                        px: 2,
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    Delete
                                                </Button>
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
                <Box sx={{ 
                    mt: 4, 
                    display: 'flex', 
                    justifyContent: 'center',
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`
                }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                fontWeight: 600
                            }
                        }}
                    />
                </Box>
            )}
        </Paper>
    );
};

export default NoticeBoard;