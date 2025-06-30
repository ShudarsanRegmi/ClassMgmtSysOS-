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
import { useTheme } from '../../../App';
import { getThemeColors } from '../../../utils/themeColors';
import DeadlineForm from '../../../components/DeadlineForm';
import DeadlineCard from './DeadlineCard';
import DeadlineStats from './DeadlineStats';

const DeadlinesTab = ({ deadlines = [], courseId, semesterId, onDeadlineUpdate }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
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
    <Box style={{ background: colors.background.primary, minHeight: '100vh', padding: 24 }}>
      <Box style={{ background: colors.background.card, borderRadius: 12, boxShadow: colors.shadow.card, padding: 24 }}>
        {/* Header and Add Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={700} style={{ color: colors.text.primary }}>
            📌 Deadlines
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleClickOpen}
            sx={{
              backgroundColor: colors.button.primary.background,
              color: colors.button.primary.text,
              fontWeight: 600,
              borderRadius: 8,
              boxShadow: colors.shadow.card,
              '&:hover': {
                backgroundColor: colors.button.primary.hover,
              },
              '&:disabled': {
                backgroundColor: colors.button.primary.disabled,
              }
            }}
          >
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
            <Typography align="center" sx={{ color: colors.text.secondary, py: 4 }}>
              No deadlines found.
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.dialog.background,
            color: colors.dialog.text,
            border: `1px solid ${colors.dialog.border}`,
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ color: colors.text.primary }}>Add New Deadline</DialogTitle>
        <DialogContent>
          <DeadlineForm
            courseId={courseId}
            semesterId={semesterId}
            onSubmitSuccess={handleDeadlineSuccess}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
            sx={{
              color: colors.button.secondary.text,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: colors.button.secondary.hover,
              }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeadlinesTab;
