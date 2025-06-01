import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add,
  Download,
  CalendarToday
} from '@mui/icons-material';

const WhiteboardTab = ({ shots }) => {
  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Whiteboard Shots</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
        >
          Upload Shot
        </Button>
      </Box>

      {shots?.length > 0 ? (
        <Grid container spacing={3}>
          {shots.map((shot) => (
            <Grid item xs={12} sm={6} md={4} key={shot._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={shot.fileUrl}
                  alt={shot.title}
                  sx={{
                    objectFit: 'cover',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.9
                    }
                  }}
                  onClick={() => window.open(shot.fileUrl, '_blank')}
                />
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" noWrap>
                      {shot.title}
                    </Typography>
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        onClick={() => window.open(shot.fileUrl, '_blank')}
                      >
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mt={1}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                      {new Date(shot.lectureDate).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="textSecondary" mt={1}>
                    {shot.topic}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="textSecondary">
            No whiteboard shots have been uploaded for this course yet.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default WhiteboardTab; 