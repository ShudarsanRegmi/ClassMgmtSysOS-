import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import {
  Assignment,
  Book,
  Description,
  Note,
  PhotoLibrary,
  Download,
  ThumbUp,
  ThumbUpOutlined,
  Add
} from '@mui/icons-material';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


// A separate interface to display the infos related to a particular course
const CourseView = () => {
  const { courseId } = useParams();
  const { currentSemester } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [materials, setMaterials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!courseId || !currentSemester?.id) return;

      try {
        const response = await api.get(`/materials/${courseId}/${currentSemester.id}`);
        setMaterials(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch course materials');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [courseId, currentSemester]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDownload = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  const handleLikeNote = async (noteId) => {
    try {
      await api.post(`/materials/notes/${noteId}/like`);
      // Refresh materials after like
      const response = await api.get(`/materials/${courseId}/${currentSemester.id}`);
      setMaterials(response.data.data);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Course Header */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {materials?.course?.title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {materials?.course?.code} • {materials?.course?.credits} credits
        </Typography>
      </Paper>

      {/* Material Tabs */}
      <Paper elevation={1}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Assignment />} label="Deadlines" />
          <Tab icon={<Book />} label="Syllabus" />
          <Tab icon={<Description />} label="Materials" />
          <Tab icon={<Note />} label="Shared Notes" />
          <Tab icon={<PhotoLibrary />} label="Whiteboard" />
        </Tabs>

        {/* Deadlines Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button startIcon={<Add />} variant="contained" color="primary">
              Add Deadline
            </Button>
          </Box>
          <List>
            {materials?.deadlines?.map((deadline) => (
              <React.Fragment key={deadline._id}>
                <ListItem>
                  <ListItemIcon>
                    <Assignment color={deadline.status === 'UPCOMING' ? 'primary' : 'action'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={deadline.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textSecondary">
                          Due: {new Date(deadline.dueDate).toLocaleDateString()}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          {deadline.description}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={deadline.status}
                      color={
                        deadline.status === 'UPCOMING' ? 'primary' :
                        deadline.status === 'ONGOING' ? 'warning' : 'default'
                      }
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        {/* Syllabus Tab */}
        <TabPanel value={activeTab} index={1}>
          {materials?.syllabus ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Course Syllabus
              </Typography>
              {materials.syllabus.units.map((unit, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Unit {index + 1}: {unit.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Duration: {unit.duration} hours
                  </Typography>
                  <List dense>
                    {unit.topics.map((topic, topicIndex) => (
                      <ListItem key={topicIndex}>
                        <ListItemIcon>
                          <Book fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={topic} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ))}
            </Box>
          ) : (
            <Alert severity="info">No syllabus uploaded yet</Alert>
          )}
        </TabPanel>

        {/* Materials Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button startIcon={<Add />} variant="contained" color="primary">
              Upload Material
            </Button>
          </Box>
          <List>
            {materials?.courseMaterials?.map((material) => (
              <React.Fragment key={material._id}>
                <ListItem>
                  <ListItemIcon>
                    <Description />
                  </ListItemIcon>
                  <ListItemText
                    primary={material.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Unit: {material.unit}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textSecondary">
                          Uploaded by: {material.uploadedBy.name}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleDownload(material.fileUrl)}>
                      <Download />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        {/* Shared Notes Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button startIcon={<Add />} variant="contained" color="primary">
              Share Note
            </Button>
          </Box>
          <List>
            {materials?.notes?.map((note) => (
              <React.Fragment key={note._id}>
                <ListItem>
                  <ListItemIcon>
                    <Note />
                  </ListItemIcon>
                  <ListItemText
                    primary={note.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          {note.description}
                        </Typography>
                        <br />
                        <Box display="flex" alignItems="center" mt={1}>
                          {note.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                          ))}
                        </Box>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleLikeNote(note._id)}>
                      {note.likes.includes(note.uploadedBy._id) ? (
                        <ThumbUp color="primary" />
                      ) : (
                        <ThumbUpOutlined />
                      )}
                    </IconButton>
                    <IconButton onClick={() => handleDownload(note.fileUrl)}>
                      <Download />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        {/* Whiteboard Tab */}
        <TabPanel value={activeTab} index={4}>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button startIcon={<Add />} variant="contained" color="primary">
              Upload Whiteboard Shot
            </Button>
          </Box>
          <Grid container spacing={2}>
            {materials?.whiteboardShots?.map((shot) => (
              <Grid item xs={12} sm={6} md={4} key={shot._id}>
                <Paper elevation={2}>
                  <Box
                    component="img"
                    src={shot.fileUrl}
                    alt={shot.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover'
                    }}
                  />
                  <Box p={2}>
                    <Typography variant="subtitle1">{shot.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(shot.lectureDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default CourseView; 