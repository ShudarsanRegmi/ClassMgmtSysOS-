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
import dayjs from 'dayjs';

const DeadlineCard = ({ deadline }) => {
  const due = dayjs(deadline.dueDate);
  const now = dayjs();

  const isOverdue = now.isAfter(due);
  const isDueSoon = now.add(1, 'day').isAfter(due);

  const getStatus = () => {
    if (isOverdue) return { label: 'Overdue', color: 'error' };
    if (isDueSoon) return { label: 'Due Soon', color: 'warning' };
    return { label: 'Upcoming', color: 'success' };
  };

  const status = getStatus();

  return (
    <Card
      variant="outlined"
      className="rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
      sx={{ mb: 1 }}
    >
      <CardContent className="flex flex-col gap-2">
        <Box className="flex justify-between items-center">
          <Typography variant="subtitle1" fontWeight={600} className="truncate">
            {deadline.title}
          </Typography>
          <Chip label={status.label} color={status.color} size="small" />
        </Box>

        <Box className="flex gap-2 flex-wrap">
          <Chip label={deadline.type} size="small" variant="outlined" />
          <Chip
            label={dayjs(deadline.dueDate).format('MMM D, YYYY h:mm A')}
            size="small"
            variant="outlined"
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          className="line-clamp-3"
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
                border: '1px solid #ccc',
                borderRadius: 1,
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
