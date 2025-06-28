import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const StatBox = ({ label, count, color }) => (
  <Paper
    elevation={2}
    className="p-4 rounded-xl flex-1 text-center"
    sx={{ borderLeft: `6px solid ${color}` }}
  >
    <Typography variant="h6" fontWeight={600}>{count}</Typography>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
  </Paper>
);

const DeadlineStats = ({ total, upcoming, overdue }) => (
  <Box display="flex" gap={2} mb={4}>
    <StatBox label="Total Deadlines" count={total} color="#2196f3" />
    <StatBox label="Upcoming" count={upcoming} color="#4caf50" />
    <StatBox label="Overdue" count={overdue} color="#f44336" />
  </Box>
);

export default DeadlineStats;
