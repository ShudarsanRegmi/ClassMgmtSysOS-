import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, IconButton, TextField, MenuItem, Button } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/event.service';
import EventCard from './EventCard';
import EventDialog from './EventDialog';
import toast from 'react-hot-toast';

const EVENT_TAGS = ['Academic', 'Cultural', 'Sports', 'Technical', 'Workshop', 'Industrial Visit', 'Other'];

export default function EventTimeline({ classId }) {
    const { user, currentSemester } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        semester: currentSemester?.id || '',
        tags: [],
        startDate: '',
        endDate: '',
        sort: '-date'
    });
    const [showFilters, setShowFilters] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Check if user has elevated privileges using the class code
    let hasElevatedPrivileges = user?.role === 'ADMIN' || 
    user?.role === 'FACULTY' || 
    user?.role === 'CR' ||
    user?.role === 'STUDENT';

    hasElevatedPrivileges = true; // Temporarily allowing all users to create/edit events

    // Fetch events using class code
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await eventService.getClassEvents(classId, filters);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [classId, filters]);

    // Handle filter changes
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    // Handle tag toggle
    const handleTagToggle = (tag) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    // Handle event actions
    const handleEventAction = async (action, formData = null) => {
        try {
            switch (action) {
                case 'create':
                    await eventService.createEvent(formData);
                    toast.success('Event created successfully');
                    break;
                case 'update':
                    await eventService.updateEvent(selectedEvent.id, formData);
                    toast.success('Event updated successfully');
                    break;
                case 'delete':
                    await eventService.deleteEvent(selectedEvent.id);
                    toast.success('Event deleted successfully');
                    break;
                default:
                    return;
            }
            fetchEvents();
            setDialogOpen(false);
            setSelectedEvent(null);
        } catch (error) {
            console.error('Error handling event action:', error);
            toast.error('Operation failed');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" component="h2">
                    Class Events Timeline
                </Typography>
                <Box>
                    <IconButton onClick={() => setShowFilters(!showFilters)}>
                        <FilterIcon />
                    </IconButton>
                    <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        onClick={() => setDialogOpen(true)}
                        sx={{ ml: 1 }}
                    >
                        Add Event
                    </Button>
                </Box>
            </Box>

            {/* Filters */}
            {showFilters && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                        <TextField
                            select
                            label="Semester"
                            value={filters.semester}
                            onChange={(e) => handleFilterChange('semester', e.target.value)}
                            sx={{ minWidth: 200 }}
                        >
                            <MenuItem value="">All Semesters</MenuItem>
                            {/* Add semester options */}
                        </TextField>
                        <TextField
                            type="date"
                            label="Start Date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            type="date"
                            label="End Date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            select
                            label="Sort By"
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                        >
                            <MenuItem value="-date">Latest First</MenuItem>
                            <MenuItem value="date">Oldest First</MenuItem>
                        </TextField>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {EVENT_TAGS.map(tag => (
                            <Chip
                                key={tag}
                                label={tag}
                                onClick={() => handleTagToggle(tag)}
                                color={filters.tags.includes(tag) ? 'primary' : 'default'}
                                variant={filters.tags.includes(tag) ? 'filled' : 'outlined'}
                            />
                        ))}
                    </Box>
                </Paper>
            )}

            {/* Timeline */}
            {loading ? (
                <Typography>Loading events...</Typography>
            ) : events.length === 0 ? (
                <Typography>No events found</Typography>
            ) : (
                <Timeline position="alternate">
                    {events.map((event, index) => (
                        <TimelineItem key={event.id}>
                            <TimelineSeparator>
                                <TimelineDot color="primary" />
                                {index < events.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <EventCard
                                    event={event}
                                    onEdit={() => {
                                        setSelectedEvent(event);
                                        setDialogOpen(true);
                                    }}
                                    onDelete={() => {
                                        setSelectedEvent(event);
                                        handleEventAction('delete');
                                    }}
                                    hasElevatedPrivileges={hasElevatedPrivileges}
                                />
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            )}

            {/* Create/Edit Dialog */}
            <EventDialog
                open={dialogOpen}
                event={selectedEvent}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedEvent(null);
                }}
                onSubmit={(eventData) => {
                    handleEventAction(selectedEvent ? 'update' : 'create', eventData);
                }}
            />
        </Box>
    );
} 