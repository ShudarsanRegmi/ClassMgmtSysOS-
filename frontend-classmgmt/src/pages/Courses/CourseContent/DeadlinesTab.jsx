import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Divider
} from '@mui/material';
import { Assignment, Add } from '@mui/icons-material';

const DeadlinesTab = ({ deadlines }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'primary';
      case 'ONGOING':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Deadlines</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
        >
          Add Deadline
        </Button>
      </Box>

      {deadlines?.length > 0 ? (
        <List>
          {deadlines.map((deadline) => (
            <React.Fragment key={deadline._id}>
              <ListItem>
                <ListItemIcon>
                  <Assignment color={deadline.status === 'UPCOMING' ? 'primary' : 'action'} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle1">{deadline.title}</Typography>
                      <Chip
                        label={deadline.status}
                        color={getStatusColor(deadline.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary">
                        Due: {new Date(deadline.dueDate).toLocaleDateString()} at{' '}
                        {new Date(deadline.dueDate).toLocaleTimeString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {deadline.description}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="textSecondary">
            No deadlines have been set for this course yet.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default DeadlinesTab; 