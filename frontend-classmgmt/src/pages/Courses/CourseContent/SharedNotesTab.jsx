import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Note,
  ThumbUp,
  ThumbUpOutlined,
  Download,
  Add,
  Verified
} from '@mui/icons-material';

const SharedNotesTab = ({ notes }) => {
  const handleLike = async (noteId) => {
    // TODO: Implement like functionality
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Shared Notes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
        >
          Share Notes
        </Button>
      </Box>

      {notes?.length > 0 ? (
        <Grid container spacing={3}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note._id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Note color="primary" />
                    <Box ml={1} flexGrow={1}>
                      <Typography variant="subtitle1" component="div">
                        {note.title}
                        {note.isVerified && (
                          <Tooltip title="Verified by instructor">
                            <Verified color="primary" fontSize="small" sx={{ ml: 1 }} />
                          </Tooltip>
                        )}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {note.description}
                  </Typography>

                  <Box display="flex" alignItems="center" mt={2} mb={2}>
                    <Avatar
                      src={note.uploadedBy.photoUrl}
                      alt={note.uploadedBy.name}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                      {note.uploadedBy.name}
                    </Typography>
                  </Box>

                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {note.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Box display="flex" alignItems="center">
                    <Tooltip title="Like">
                      <IconButton
                        size="small"
                        onClick={() => handleLike(note._id)}
                      >
                        <Badge badgeContent={note.likes.length} color="primary">
                          {note.likes.includes(note.uploadedBy._id) ? (
                            <ThumbUp color="primary" />
                          ) : (
                            <ThumbUpOutlined />
                          )}
                        </Badge>
                      </IconButton>
                    </Tooltip>
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                      {new Date(note.uploadedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Tooltip title="Download">
                    <IconButton
                      size="small"
                      onClick={() => window.open(note.fileUrl, '_blank')}
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="textSecondary">
            No notes have been shared for this course yet.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default SharedNotesTab; 