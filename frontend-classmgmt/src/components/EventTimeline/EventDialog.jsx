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
import axios from 'axios';

const EVENT_TAGS = ['Academic', 'Cultural', 'Sports', 'Technical', 'Workshop', 'Industrial Visit', 'Other'];

export default function EventDialog({ open, event, onClose, onSubmit }) {
    const { currentSemester } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        date: dayjs(),
        caption: '',
        tags: [],
        images: []
    });
    const [imageUrls, setImageUrls] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
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
        } else {
            // Reset form for new event
            setFormData({
                title: '',
                date: dayjs(),
                caption: '',
                tags: [],
                images: []
            });
            setImageUrls([]);
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

    // Handle image upload
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        setIsUploading(true);
        setError('');
        
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            const response = await axios.post('http://localhost:3001/api/events/upload-images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...response.data.images]
            }));
        } catch (error) {
            console.error('Error uploading images:', error);
            setError('Failed to upload images. Please try again.');
        } finally {
            setIsUploading(false);
        }
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
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Handle form submission
    const handleSubmit = () => {
        const eventData = {
            ...formData,
            date: formData.date.toISOString(),
            semesterId: currentSemester?.id
        };
        onSubmit(eventData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {event ? 'Edit Event' : 'Create New Event'}
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
                            disabled={isUploading}
                        >
                            {isUploading ? 'Uploading...' : 'Add Images'}
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
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
                    disabled={!formData.title || !formData.caption}
                >
                    {event ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}