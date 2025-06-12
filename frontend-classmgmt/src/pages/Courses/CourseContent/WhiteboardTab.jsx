import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Divider,
  MobileStepper,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  ZoomIn as ZoomInIcon,
  Delete as DeleteIcon,
  Download,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { useTheme } from '@mui/material/styles';
import WhiteboardShotForm from '../../../components/WhiteboardShotForm';

const WhiteboardTab = ({ shots = [], courseId, semesterId, onShotUpdate }) => {
  const { userProfile } = useAuth();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async (shotId) => {
    if (!window.confirm('Are you sure you want to delete this whiteboard shot?')) return;

    try {
      await api.delete(`/courses/${courseId}/materials/${semesterId}/whiteboard/${shotId}`);
      if (onShotUpdate) {
        onShotUpdate(shots.filter(s => s._id !== shotId));
      }
    } catch (error) {
      console.error('Error deleting whiteboard shot:', error);
    }
  };

  const handlePreview = (shot) => {
    const images = Array.isArray(shot.files) 
      ? shot.files.map(file => file.url || file) 
      : [shot.fileUrl];
    setPreviewImages(images);
    setPreviewOpen(true);
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Group shots by date
  const groupedShots = shots.reduce((groups, shot) => {
    const date = new Date(shot.lectureDate).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(shot);
    return groups;
  }, {});

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Whiteboard Shots</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Shot
        </Button>
      </Box>

      {Object.entries(groupedShots)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, dateShots]) => (
          <Box key={date} mb={4}>
            <Typography variant="h6" gutterBottom>
              {date}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              {dateShots.map((shot) => (
                <Grid item xs={12} sm={6} md={4} key={shot._id}>
                  <Card>
                    <Box position="relative">
                      <CardMedia
                        component="img"
                        height="200"
                        image={Array.isArray(shot.files) 
                          ? (shot.files[0].url || shot.files[0]) 
                          : shot.fileUrl}
                        alt={shot.title}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handlePreview(shot)}
                      />
                      {Array.isArray(shot.files) && shot.files.length > 1 && (
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            right: 8,
                            bottom: 8,
                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            px: 1,
                            borderRadius: 1,
                          }}
                        >
                          +{shot.files.length - 1} more
                        </Typography>
                      )}
                      <IconButton
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                        onClick={() => handlePreview(shot)}
                      >
                        <ZoomInIcon />
                      </IconButton>
                    </Box>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {shot.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Topic: {shot.topic}
                      </Typography>
                      <Box display="flex" justifyContent="flex-end" mt={1}>
                        <IconButton
                          size="small"
                          href={Array.isArray(shot.files) 
                            ? (shot.files[0].url || shot.files[0]) 
                            : shot.fileUrl}
                          target="_blank"
                          download
                        >
                          <Download />
                        </IconButton>
                        {(userProfile.role === 'FACULTY' || userProfile.role === 'CA') && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(shot._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <WhiteboardShotForm
            courseId={courseId}
            semesterId={semesterId}
            classId={userProfile?.classId}
            onSuccess={(newShot) => {
              if (onShotUpdate) {
                onShotUpdate([...shots, newShot]);
              }
              handleClose();
            }}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {previewImages.map((image, index) => (
            <Fade in={activeStep === index} key={index} timeout={300}>
              <Box
                sx={{
                  display: activeStep === index ? 'block' : 'none',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  textAlign: 'center'
                }}
              >
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'calc(80vh - 96px)',
                    objectFit: 'contain',
                    margin: '0 auto',
                  }}
                />
              </Box>
            </Fade>
          ))}
          {previewImages.length > 1 && (
            <MobileStepper
              steps={previewImages.length}
              position="static"
              activeStep={activeStep}
              sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
              }}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === previewImages.length - 1}
                >
                  Next
                  {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  Back
                </Button>
              }
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button
            variant="contained"
            href={previewImages[activeStep]}
            target="_blank"
            download
          >
            Download Current Image
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WhiteboardTab; 