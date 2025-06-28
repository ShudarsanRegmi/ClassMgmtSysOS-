import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '../../../App';
import { getThemeColors } from '../../../utils/themeColors';

const StatBox = ({ label, count, color, colors }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: 3,
      textAlign: 'center',
      backgroundColor: colors.background.card,
      borderLeft: `6px solid ${color}`,
      boxShadow: colors.shadow.card,
      minWidth: 0,
    }}
  >
    <Typography variant="h6" fontWeight={700} sx={{ color: colors.text.primary }}>{count}</Typography>
    <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: 500 }}>{label}</Typography>
  </Paper>
);

const DeadlineStats = ({ total, upcoming, overdue }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <Box display="flex" gap={2} mb={4}>
      <StatBox label="Total Deadlines" count={total} color={colors.status.info} colors={colors} />
      <StatBox label="Upcoming" count={upcoming} color={colors.status.success} colors={colors} />
      <StatBox label="Overdue" count={overdue} color={colors.status.error} colors={colors} />
    </Box>
  );
};

export default DeadlineStats;
