import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Schedule = () => {
  const { currentSemester, classId } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        if (!currentSemester?.id) return;

        const response = await api.get(
          `/timetable/${classId}/${currentSemester.id}`
        );
        setSchedule(response.data.data.schedule);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setError('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [currentSemester, classId]);

  const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const parseTimeSlot = (timeString) => {
    const [start, end] = timeString.split('–').map(t => t.trim());
    return {
      start,
      end,
      startMinutes: parseTimeToMinutes(start),
      endMinutes: parseTimeToMinutes(end)
    };
  };

  const isConsecutiveSession = (currentSlot, nextSlot) => {
    if (!nextSlot) return false;
    
    const current = parseTimeSlot(currentSlot.time);
    const next = parseTimeSlot(nextSlot.time);
    
    return (
      currentSlot.course_code === nextSlot.course_code &&
      currentSlot.course_name === nextSlot.course_name &&
      Math.abs(next.startMinutes - current.endMinutes) <= 5 // Allow 5 minutes tolerance
    );
  };

  const getConsecutiveSessionsCount = (day, startIndex) => {
    let count = 1;
    for (let i = startIndex; i < schedule[day].length - 1; i++) {
      if (isConsecutiveSession(schedule[day][i], schedule[day][i + 1])) {
        count++;
      } else {
        break;
      }
    }
    return count;
  };

  const renderTimeSlot = (slot, rowSpan = 1) => {
    if (!slot) return null;

    const facultyNames = slot.faculty ? slot.faculty.split(/[/-]/).map(name => name.trim()) : [];
    const time = parseTimeSlot(slot.time);
    
    // Skip slots after 3:30 PM (15:30)
    if (time.startMinutes >= parseTimeToMinutes('15:30')) {
      return null;
    }

    return (
      <TableCell
        key={`${slot.course_code}-${slot.time}`}
        align="center"
        sx={{
          border: 1,
          borderColor: 'divider',
          p: 1,
          minWidth: '150px',
          ...(rowSpan > 1 && {
            verticalAlign: 'middle',
            rowSpan: rowSpan
          })
        }}
      >
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'medium' }}>
          {slot.course_name}
        </Typography>
        {slot.course_code && (
          <Typography variant="caption" display="block" color="text.secondary">
            {slot.course_code}
          </Typography>
        )}
        {facultyNames.length > 0 && (
          <Typography variant="caption" display="block" color="text.secondary">
            {facultyNames.join(', ')}
          </Typography>
        )}
      </TableCell>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!schedule) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No schedule available</Typography>
      </Box>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = schedule[days[0]]
    .map(slot => parseTimeSlot(slot.time))
    .filter(time => time.startMinutes < parseTimeToMinutes('15:30')); // Filter out slots after 3:30 PM

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        mt: 2,
        overflowX: 'auto',
        '& .MuiTable-root': {
          minWidth: 1000,
          borderCollapse: 'separate',
          borderSpacing: 0
        }
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell 
              sx={{ 
                fontWeight: 'bold',
                position: 'sticky',
                left: 0,
                backgroundColor: 'background.paper',
                zIndex: 2
              }}
            >
              Day / Time
            </TableCell>
            {timeSlots.map((time, index) => (
              <TableCell 
                key={`header-${time.start}-${time.end}`}
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  minWidth: '150px'
                }}
              >
                {time.start}–{time.end}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {days.map(day => (
            <TableRow key={day}>
              <TableCell 
                component="th" 
                scope="row"
                sx={{ 
                  fontWeight: 'bold',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: 'background.paper',
                  zIndex: 1
                }}
              >
                {day}
              </TableCell>
              {schedule[day]
                .filter(slot => parseTimeSlot(slot.time).startMinutes < parseTimeToMinutes('15:30'))
                .map((slot, index) => {
                  // Skip rendering if this slot is part of a consecutive session
                  if (index > 0 && isConsecutiveSession(schedule[day][index - 1], slot)) {
                    return null;
                  }
                  
                  // Calculate how many consecutive sessions we have
                  const consecutiveCount = getConsecutiveSessionsCount(day, index);
                  
                  return renderTimeSlot(slot, consecutiveCount);
                })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Schedule; 