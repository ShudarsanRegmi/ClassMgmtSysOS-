import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  Book,
  Timer,
  Add
} from '@mui/icons-material';

const SyllabusTab = ({ syllabus }) => {
  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Course Syllabus</Typography>
        {!syllabus && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
          >
            Add Syllabus
          </Button>
        )}
      </Box>

      {syllabus ? (
        <Box>
          <Box mb={3}>
            <Chip
              icon={<Timer />}
              label={`Total Duration: ${syllabus.totalHours} hours`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {syllabus.units.map((unit, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" pr={2}>
                  <Typography variant="subtitle1">
                    Unit {index + 1}: {unit.title}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${unit.duration} hours`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {unit.topics.map((topic, topicIndex) => (
                    <ListItem key={topicIndex}>
                      <ListItemIcon>
                        <Book color="action" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={topic} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="textSecondary">
            No syllabus has been uploaded for this course yet.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default SyllabusTab; 