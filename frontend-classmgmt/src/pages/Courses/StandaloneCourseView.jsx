import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Assignment,
  Book,
  Description,
  Note,
  PhotoLibrary,
  ArrowBack,
  Person,
  CalendarToday,
  School,
  History
} from '@mui/icons-material';

// Import the individual content components
import DeadlinesTab from './CourseContent/DeadlinesTab';
import SyllabusTab from './CourseContent/SyllabusTab';
import MaterialsTab from './CourseContent/MaterialsTab';
import SharedNotesTab from './CourseContent/SharedNotesTab';
import WhiteboardTab from './CourseContent/WhiteboardTab';
import PYQsTab from './CourseContent/PYQsTab';

// Component to display the course specific content
const StandaloneCourseView = () => {
  const { courseId, semesterId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [activeSection, setActiveSection] = useState('deadlines');
  const [courseData, setCourseData] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const drawerWidth = 280;

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !semesterId) return;

      try {
        const [courseResponse, materialsResponse] = await Promise.all([
          api.get(`/courses/${courseId}/semester/${semesterId}`),
          api.get(`/courses/${courseId}/materials/${semesterId}`)
        ]);

        setCourseData(courseResponse.data.data);
        setMaterials(materialsResponse.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, semesterId]);

  const navigationItems = [
    { id: 'deadlines', label: 'Deadlines', icon: <Assignment /> },
    { id: 'syllabus', label: 'Syllabus', icon: <Book /> },
    { id: 'materials', label: 'Course Materials', icon: <Description /> },
    { id: 'notes', label: 'Shared Notes', icon: <Note /> },
    { id: 'whiteboard', label: 'Whiteboard Shots', icon: <PhotoLibrary /> },
    { id: 'pyqs', label: 'PYQs', icon: <History /> },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'deadlines':
        return <DeadlinesTab 
          deadlines={materials?.deadlines || []} 
          courseId={courseId} 
          semesterId={semesterId}
          onDeadlineUpdate={(updatedDeadlines) => {
            setMaterials(prev => ({
              ...prev,
              deadlines: updatedDeadlines
            }));
          }}
        />;
      case 'syllabus':
        return <SyllabusTab 
          syllabus={materials?.syllabus}
          courseId={courseId}
          semesterId={semesterId}
          onSyllabusUpdate={(updatedSyllabus) => {
            setMaterials(prev => ({
              ...prev,
              syllabus: updatedSyllabus
            }));
          }}
        />;
      case 'materials':
        return <MaterialsTab 
          materials={materials?.courseMaterials || []} 
          courseId={courseId} 
          semesterId={semesterId}
          onMaterialUpdate={(updatedMaterials) => {
            setMaterials(prev => ({
              ...prev,
              courseMaterials: updatedMaterials
            }));
          }}
        />;
      case 'notes':
        return <SharedNotesTab 
          notes={materials?.notes}
          courseId={courseId}
          semesterId={semesterId}
          onNoteUpdate={(updatedNotes) => {
            setMaterials(prev => ({
              ...prev,
              notes: updatedNotes
            }));
          }}
        />;
      case 'whiteboard':
        return <WhiteboardTab 
          shots={materials?.whiteboardShots}
          courseId={courseId}
          semesterId={semesterId}
          onShotUpdate={(updatedShots) => {
            setMaterials(prev => ({
              ...prev,
              whiteboardShots: updatedShots
            }));
          }}
        />;
      case 'pyqs':
        return <PYQsTab courseId={courseId} semesterId={semesterId} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard/courses')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {courseData?.code} - {courseData?.title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Side Navigation Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: '64px', // Height of AppBar
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 64px)', // Set explicit height
            overflow: 'hidden', // Prevent drawer from scrolling
          },
        }}
      >
        {/* Course Info Section */}
        <Box sx={{ p: 3, flexShrink: 0 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Avatar
              src={courseData?.faculty?.photoUrl}
              sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
            >
              <Person />
            </Avatar>
            <Typography variant="subtitle1" gutterBottom>
              {courseData?.faculty?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Course Instructor
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <School sx={{ mr: 1, fontSize: 20 }} />
              {courseData?.credits} Credits
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday sx={{ mr: 1, fontSize: 20 }} />
              {courseData?.semester?.name}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ flexShrink: 0 }} />

        {/* Navigation List - Scrollable */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <List 
            sx={{ 
              height: '100%',
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c1c1',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#a8a8a8',
              },
            }}
          >
            {navigationItems.map((item) => (
              <ListItem
                component="div"
                key={item.id}
                selected={activeSection === item.id}
                onClick={() => setActiveSection(item.id)}
                sx={{ '&:hover': { cursor: 'pointer' } }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px', // Height of AppBar
          backgroundColor: theme.palette.grey[100],
          minHeight: '100vh'
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default StandaloneCourseView; 