import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Paper,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import { createNotice, getNotice, updateNotice } from '../services/noticeService';

const NoticeForm = ({ 
    noticeId = null,  // For editing existing notice
    onSuccess,        // Callback after successful submission
    onCancel,         // Optional cancel callback
    defaultValues,    // Optional default values
    hideTargetAudience = false, // Option to hide target audience field
    disableRedirect = false // New prop to control redirection
}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        targetAudience: 'all',
        priority: 'medium',
        ...defaultValues
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (noticeId) {
            fetchNotice();
        }
    }, [noticeId]);

    const fetchNotice = async () => {
        try {
            setLoading(true);
            setError('');
            const notice = await getNotice(noticeId);
            setFormData({
                title: notice.title,
                content: notice.content,
                targetAudience: notice.targetAudience,
                priority: notice.priority
            });
        } catch (error) {
            console.error('Error fetching notice:', error);
            if (error.response?.status === 404) {
                setError('Notice not found.');
            } else {
                setError('Error loading notice. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = [];
        if (!formData.title.trim()) errors.push('Title is required');
        if (!formData.content.trim()) errors.push('Content is required');
        if (!['all', 'students', 'teachers', 'staff'].includes(formData.targetAudience)) {
            errors.push('Invalid target audience');
        }
        if (!['low', 'medium', 'high'].includes(formData.priority)) {
            errors.push('Invalid priority level');
        }
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '));
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            console.group('📤 Notice Form Submission');
            console.log('Notice ID:', noticeId);
            console.log('Form Data:', formData);
            console.groupEnd();

            let result;
            if (noticeId) {
                result = await updateNotice(noticeId, formData);
                setSuccess('Notice updated successfully!');
            } else {
                result = await createNotice(formData);
                setSuccess('Notice created successfully!');
            }
            
            if (onSuccess) {
                onSuccess(result);
            }

            // Add delay before navigation
            if (!disableRedirect) {
                setTimeout(() => {
                    navigate('/notices');
                }, 1500);
            }
        } catch (error) {
            console.error('Error saving notice:', error);
            if (error.response?.status === 403) {
                setError('You do not have permission to perform this action.');
            } else if (error.response?.data?.errors) {
                setError(error.response.data.errors.map(err => err.msg).join(', '));
            } else {
                setError('Error saving notice. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCloseMessage = () => {
        setError('');
        setSuccess('');
    };

    if (loading && !formData.title) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={handleCloseMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseMessage} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={!!success} 
                autoHideDuration={1500} 
                onClose={handleCloseMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseMessage} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    {noticeId ? 'Edit Notice' : 'Create Notice'}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        margin="normal"
                        disabled={loading}
                        error={!!error && !formData.title.trim()}
                        helperText={error && !formData.title.trim() ? 'Title is required' : ''}
                    />

                    <TextField
                        fullWidth
                        label="Content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        margin="normal"
                        disabled={loading}
                        error={!!error && !formData.content.trim()}
                        helperText={error && !formData.content.trim() ? 'Content is required' : ''}
                    />

                    {!hideTargetAudience && (
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Target Audience</InputLabel>
                            <Select
                                name="targetAudience"
                                value={formData.targetAudience}
                                onChange={handleChange}
                                label="Target Audience"
                                disabled={loading}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="students">Students</MenuItem>
                                <MenuItem value="teachers">Teachers</MenuItem>
                                <MenuItem value="staff">Staff</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Priority</InputLabel>
                        <Select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            label="Priority"
                            disabled={loading}
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                noticeId ? 'Update Notice' : 'Create Notice'
                            )}
                        </Button>
                        {onCancel && (
                            <Button
                                variant="outlined"
                                onClick={onCancel}
                                disabled={loading}
                                fullWidth
                            >
                                Cancel
                            </Button>
                        )}
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default NoticeForm; 