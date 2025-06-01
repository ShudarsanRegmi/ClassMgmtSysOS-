import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Description,
  PictureAsPdf,
  Slideshow,
  InsertDriveFile,
  Download,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const MATERIAL_TYPES = ['LECTURE_NOTE', 'PRESENTATION', 'REFERENCE', 'OTHER'];

const getFileIcon = (fileType) => {
  if (fileType?.includes('pdf')) return <PictureAsPdf />;
  if (fileType?.includes('presentation') || fileType?.includes('powerpoint')) return <Slideshow />;
  if (fileType?.includes('document') || fileType?.includes('word')) return <Description />;
  return <InsertDriveFile />;
};

const MaterialsTab = ({ materials = [], courseId, semesterId, onMaterialUpdate }) => {
  const { user, userRole } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    materialType: 'LECTURE_NOTE',
    unit: '1'
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      materialType: 'LECTURE_NOTE',
      unit: '1'
    });
    setSelectedFile(null);
    setLoading(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('materialType', formData.materialType);
      formDataToSend.append('unit', formData.unit);

      const response = await api.post(
        `/courses/${courseId}/materials/${semesterId}/material`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (onMaterialUpdate) {
        const newMaterial = response.data.data;
        onMaterialUpdate([...(materials || []), newMaterial]);
      }
      
      setFormData({
        title: '',
        description: '',
        materialType: 'LECTURE_NOTE',
        unit: '1'
      });
      setSelectedFile(null);
      
      alert('Material uploaded successfully! You can upload another or close the dialog.');
    } catch (error) {
      console.error('Error uploading material:', error);
      alert('Error uploading material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      await api.delete(`/courses/${courseId}/materials/${semesterId}/material/${materialId}`);
      if (onMaterialUpdate) {
        onMaterialUpdate((materials || []).filter(m => m._id !== materialId));
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Error deleting material. Please try again.');
    }
  };

  const isInstructorOrCA = userRole === 'FACULTY' || userRole === 'CA' || userRole === 'STUDENT';

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Course Materials</Typography>
        {isInstructorOrCA && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            disabled={loading}
          >
            Add Material
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(materials) && materials.map((material) => (
          <Grid item xs={12} md={6} key={material._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box display="flex" alignItems="center">
                    {getFileIcon(material.fileType)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {material.title}
                    </Typography>
                  </Box>
                  <Box>
                    <Chip
                      label={material.materialType.replace('_', ' ')}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`Unit ${material.unit}`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
                <Typography color="textSecondary" sx={{ mt: 1, mb: 2 }}>
                  {material.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="textSecondary">
                    Uploaded by {material.uploadedBy?.name} on{' '}
                    {new Date(material.uploadedAt).toLocaleDateString()}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      href={material.fileUrl}
                      target="_blank"
                      download
                    >
                      <Download />
                    </IconButton>
                    {isInstructorOrCA && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(material._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        disableEscapeKeyDown={loading}
      >
        <DialogTitle>Add New Material</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              disabled={loading}
            />
            <TextField
              select
              fullWidth
              label="Material Type"
              value={formData.materialType}
              onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
              margin="normal"
              disabled={loading}
            >
              {MATERIAL_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace('_', ' ')}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Unit"
              type="number"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              margin="normal"
              inputProps={{ min: "1" }}
              disabled={loading}
            />
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 2, width: '100%' }}
              disabled={loading}
            >
              {selectedFile ? 'Change File' : 'Upload Material'}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                disabled={loading}
              />
            </Button>
            {selectedFile && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected file: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Close</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading || !formData.title || !selectedFile}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaterialsTab; 