import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import DeadlineForm from '../../../components/DeadlineForm';

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

  const getStatusColor = (deadline) => {
    const now = dayjs();
    const dueDate = dayjs(deadline.dueDate);
    
    if (now.isAfter(dueDate)) return 'error';
    if (now.add(1, 'day').isAfter(dueDate)) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Deadlines</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Deadline
        </Button>
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(deadlines) && deadlines.map((deadline) => (
          <Grid item xs={12} md={6} key={deadline._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" gutterBottom>
                    {deadline.title}
                  </Typography>
                  <Box>
                    <Chip
                      label={deadline.type}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={dayjs(deadline.dueDate).format('MMM D, YYYY h:mm A')}
                      color={getStatusColor(deadline)}
                      size="small"
                    />
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {deadline.description}
                </Typography>
                {deadline.fileUrl && (
                  <Button
                    variant="outlined"
                    size="small"
                    href={deadline.fileUrl}
                    target="_blank"
                    sx={{ mt: 1 }}
                  >
                    View Attachment
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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