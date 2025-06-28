import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import { AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useTheme } from '../../../App';
import { getThemeColors } from '../../../utils/themeColors';
import dayjs from 'dayjs';

const DeadlineCard = ({ deadline }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const due = dayjs(deadline.dueDate);
  const now = dayjs();

  const isOverdue = now.isAfter(due);
  const isDueSoon = now.add(1, 'day').isAfter(due);

  const getStatus = () => {
    if (isOverdue) return { label: 'Overdue', ...colors.interactive.statusChip.overdue };
    if (isDueSoon) return { label: 'Due Soon', background: colors.status.warning, text: '#FFFFFF' };
    return { label: 'Upcoming', ...colors.interactive.statusChip.upcoming };
  };

  const status = getStatus();

  return (
    <Card
      variant="outlined"
      sx={{ 
        mb: 2,
        backgroundColor: colors.background.card,
        borderColor: colors.border.primary,
        borderRadius: 3,
        boxShadow: colors.shadow.card,
        '&:hover': {
          boxShadow: colors.shadow.hover,
        }
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: colors.text.primary, maxWidth: '70%' }} noWrap>
            {deadline.title}
          </Typography>
          <Chip 
            label={status.label} 
            sx={{
              backgroundColor: status.background,
              color: status.text,
              fontWeight: 600,
              borderRadius: 2,
              px: 1.5,
              fontSize: 14,
            }}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          <Chip 
            label={deadline.type} 
            size="small" 
            variant="outlined"
            sx={{
              borderColor: colors.interactive.chip.border,
              color: colors.interactive.chip.text,
              backgroundColor: colors.interactive.chip.background,
              fontWeight: 500,
              borderRadius: 2,
              fontSize: 13,
            }}
          />
          <Chip
            label={dayjs(deadline.dueDate).format('MMM D, YYYY h:mm A')}
            size="small"
            variant="outlined"
            sx={{
              borderColor: colors.interactive.chip.border,
              color: colors.interactive.chip.text,
              backgroundColor: colors.interactive.chip.background,
              fontWeight: 500,
              borderRadius: 2,
              fontSize: 13,
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{ color: colors.text.secondary, mb: 1 }}
        >
          {deadline.description || <i>No description provided</i>}
        </Typography>

        {deadline.fileUrl && (
          <Tooltip title="View Attachment">
            <IconButton
              href={deadline.fileUrl}
              target="_blank"
              size="small"
              sx={{
                alignSelf: 'flex-start',
                border: `1px solid ${colors.interactive.chip.border}`,
                borderRadius: 2,
                color: colors.interactive.link,
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: colors.interactive.linkHover,
                  borderColor: colors.interactive.link,
                }
              }}
            >
              <AttachFileIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </CardContent>
    </Card>
  );
};

export default DeadlineCard;
