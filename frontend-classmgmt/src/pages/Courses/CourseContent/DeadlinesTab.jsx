import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import DeadlineForm from '../../../components/DeadlineForm';
import DeadlineCard from './DeadlineCard';
import DeadlineStats from './DeadlineStats';

const DeadlinesTab = ({ deadlines = [], courseId, semesterId, onDeadlineUpdate }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeadlineSuccess = (newDeadline) => {
    if (onDeadlineUpdate) {
      onDeadlineUpdate([...(deadlines || []), newDeadline]);
    }
    handleClose();
  };

  // Categorize deadlines
  const now = dayjs();
  const upcoming = deadlines.filter(d => dayjs(d.dueDate).isAfter(now));
  const overdue = deadlines.filter(d => dayjs(d.dueDate).isBefore(now));

  const sortedDeadlines = [...upcoming, ...overdue];

  return (
    <Box className="space-y-6">
      {/* Header and Add Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={600}>📌 Deadlines</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
          Add
        </Button>
      </Box>

      {/* Stats */}
      <DeadlineStats
        total={deadlines.length}
        upcoming={upcoming.length}
        overdue={overdue.length}
      />

      {/* List */}
      <Stack spacing={2}>
        {sortedDeadlines.map(dl => (
          <DeadlineCard key={dl._id} deadline={dl} />
        ))}
        {deadlines.length === 0 && (
          <Typography color="text.secondary" className="text-center py-4">
            No deadlines found.
          </Typography>
        )}
      </Stack>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Deadline</DialogTitle>
        <DialogContent>
          <DeadlineForm
            courseId={courseId}
            semesterId={semesterId}
            onSubmitSuccess={handleDeadlineSuccess}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeadlinesTab;
