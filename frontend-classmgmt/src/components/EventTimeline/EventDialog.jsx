import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Chip,
    IconButton,
    Typography,
    ImageList,
    ImageListItem,
    ImageListItemBar
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const EVENT_TAGS = ['Academic', 'Cultural', 'Sports', 'Technical', 'Workshop', 'Industrial Visit', 'Other'];

export default function EventDialog({ open, event, onClose, onSubmit }) {
    const { currentSemester, classId } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        date: dayjs(),
        caption: '',
        tags: [],
        images: []
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Initialize form data when editing
    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || '',
                date: dayjs(event.date) || dayjs(),
                caption: event.caption || '',
                tags: event.tags || [],
                images: event.images || []
            });
            setSelectedFiles([]);
        } else {
            // Reset form for new event
            setFormData({
                title: '',
                date: dayjs(),
                caption: '',
                tags: [],
                images: []
            });
            setSelectedFiles([]);
        }
    }, [event]);

    // Handle form field changes
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Handle tag toggle
    const handleTagToggle = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    // Handle image selection
    const handleImageSelection = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        
        // Create preview URLs for selected images
        const newImages = files.map(file => ({
            url: URL.createObjectURL(file),
            caption: '',
            file: file // Keep reference to file for upload
        }));

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    // Handle image caption change
    const handleImageCaptionChange = (index, caption) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map((img, i) => 
                i === index ? { ...img, caption } : img
            )
        }));
    };

    // Handle image deletion
    const handleImageDelete = (index) => {
        // Revoke object URL to prevent memory leaks
        if (formData.images[index].file) {
            URL.revokeObjectURL(formData.images[index].url);
        }
        
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!classId) {
            setError('No class selected');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            // Create form data for multipart submission
            const submitFormData = new FormData();
            
            // Add event data as JSON string
            const eventData = {
                title: formData.title,
                date: formData.date.toISOString(),
                caption: formData.caption,
                tags: formData.tags,
                semesterId: currentSemester?.id,
                classId
            };

            submitFormData.append('eventData', JSON.stringify(eventData));
            
            // Add existing images that were not just uploaded
            const existingImages = formData.images
                .filter(img => !img.file)
                .map(img => ({ url: img.url, caption: img.caption }));
            submitFormData.append('existingImages', JSON.stringify(existingImages));
            
            // Add new files and their captions
            const captions = {};
            formData.images.forEach((img, index) => {
                if (img.file) {
                    submitFormData.append('files', img.file);
                    captions[index] = img.caption || '';
                }
            });
            submitFormData.append('captions', JSON.stringify(captions));

            // Pass the FormData to parent component
            onSubmit(submitFormData);
            onClose();
        } catch (error) {
            console.error('Error preparing form data:', error);
            setError('Failed to prepare form data. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cleanup object URLs when dialog closes
    useEffect(() => {
        return () => {
            formData.images.forEach(img => {
                if (img.file) {
                    URL.revokeObjectURL(img.url);
                }
            });
        };
    }, []);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {event ? 'Edit Event' : 'Create New Event'}
                {classId && (
                    <Typography variant="subtitle2" color="textSecondary">
                        Class: {classId}
                    </Typography>
                )}
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Title */}
                    <TextField
                        label="Title"
                        fullWidth
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        required
                    />

                    {/* Date */}
                    <DatePicker
                        label="Event Date"
                        value={formData.date}
                        onChange={(newValue) => handleChange('date', newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />

                    {/* Caption */}
                    <TextField
                        label="Caption"
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.caption}
                        onChange={(e) => handleChange('caption', e.target.value)}
                        required
                    />

                    {/* Tags */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Tags
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {EVENT_TAGS.map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    color={formData.tags.includes(tag) ? 'primary' : 'default'}
                                    variant={formData.tags.includes(tag) ? 'filled' : 'outlined'}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Images */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Images
                        </Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<AddIcon />}
                            sx={{ mb: 2 }}
                            disabled={isSubmitting}
                        >
                            Add Images
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handleImageSelection}
                                disabled={isSubmitting}
                            />
                        </Button>
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <ImageList cols={3} gap={8}>
                            {formData.images.map((image, index) => (
                                <ImageListItem key={index}>
                                    <img
                                        src={image.url}
                                        alt={`Event image ${index + 1}`}
                                        loading="lazy"
                                    />
                                    <ImageListItemBar
                                        position="bottom"
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'white' }}
                                                onClick={() => handleImageDelete(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                        actionPosition="right"
                                    />
                                    <TextField
                                        size="small"
                                        placeholder="Image caption"
                                        value={image.caption || ''}
                                        onChange={(e) => handleImageCaptionChange(index, e.target.value)}
                                        sx={{ mt: 1 }}
                                        fullWidth
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!formData.title || !formData.caption || isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : event ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}