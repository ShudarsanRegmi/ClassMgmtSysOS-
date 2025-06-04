import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import EventTimeline from '../../components/EventTimeline/EventTimeline';

export default function ClassPage() {
    const { classId } = useAuth();

    if (!classId) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" color="error">
                    No class ID found. Please complete your profile first.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Class Timeline
            </Typography>
            <EventTimeline classId={classId} />
        </Box>
    );
} 