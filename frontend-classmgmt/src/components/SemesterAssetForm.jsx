import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Paper,
    Typography,
    Snackbar
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const SemesterAssetForm = ({ onSubmitSuccess }) => {
    const { currentSemester, availableSemesters } = useAuth();
    
    const [formData, setFormData] = useState({
        semesterId: currentSemester?.id || '',
        title: '',
        description: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setToast({ ...toast, open: false });
    };

    const showToast = (message, severity = 'success') => {
        setToast({
            open: true,
            message,
            severity
        });
    };

    const resetForm = () => {
        setFormData({
            semesterId: currentSemester?.id || '',
            title: '',
            description: ''
        });
        setFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            showToast('Please select a file to upload', 'error');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formPayload = new FormData();
            formPayload.append('file', file);
            formPayload.append('semesterId', formData.semesterId);
            formPayload.append('title', formData.title);
            formPayload.append('description', formData.description);

            const response = await api.post('/cr/semester-assets', formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            showToast('Asset uploaded successfully!');
            resetForm();
            
            if (onSubmitSuccess) {
                onSubmitSuccess(response.data);
            }
        } catch (error) {
            console.error('Error uploading asset:', error);
            showToast(error.response?.data?.message || 'Failed to upload asset', 'error');
            setError(error.response?.data?.message || 'Failed to upload asset');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {error && (
                        <Alert severity="error" onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

                    <FormControl fullWidth>
                        <InputLabel id="semester-label">Semester</InputLabel>
                        <Select
                            labelId="semester-label"
                            name="semesterId"
                            value={formData.semesterId}
                            onChange={handleChange}
                            label="Semester"
                            required
                        >
                            {availableSemesters?.map((semester) => (
                                <MenuItem 
                                    key={semester.id} 
                                    value={semester.id}
                                    selected={semester.id === currentSemester?.id}
                                >
                                    {semester.name} ({semester.code}) - {semester.status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        required
                    />

                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        sx={{ mt: 2 }}
                    >
                        Upload File
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Button>

                    {file && (
                        <Typography variant="body2" color="text.secondary">
                            Selected file: {file.name}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Upload Asset'}
                    </Button>
                </Box>
            </form>

            <Snackbar
                open={toast.open}
                autoHideDuration={6000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseToast} 
                    severity={toast.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default SemesterAssetForm; 