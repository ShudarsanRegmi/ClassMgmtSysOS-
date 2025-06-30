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
  IconButton,
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
import { useTheme } from '../../../App';
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
  const { theme } = useTheme();
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

  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('Please select a file');
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
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (onMaterialUpdate) {
        const newMaterial = response.data.data;
        onMaterialUpdate([...(materials || []), newMaterial]);
      }

      handleClose();
      alert('Material uploaded successfully!');
    } catch (error) {
      console.error('Error uploading material:', error);
      alert('Failed to upload material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      await api.delete(`/courses/${courseId}/materials/${semesterId}/material/${materialId}`);
      if (onMaterialUpdate) {
        onMaterialUpdate((materials || []).filter((m) => m._id !== materialId));
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Error deleting material. Please try again.');
    }
  };

  const isInstructorOrCA = userRole === 'FACULTY' || userRole === 'CA' || userRole === 'STUDENT';

  return (
    <Box className={theme.bg}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" className={theme.text}>
          📚 Course Materials
        </Typography>
        {isInstructorOrCA && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            disabled={loading}
            className={theme.button}
            sx={{
              backgroundColor: theme.name === 'dark' ? '#3B82F6' : '#3B82F6',
              color: 'white',
              '&:hover': {
                backgroundColor: theme.name === 'dark' ? '#1E40AF' : '#1E40AF',
              },
              '&:disabled': {
                backgroundColor: theme.name === 'dark' ? '#64748B' : '#94A3B8',
              }
            }}
          >
            Add Material
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {materials?.length > 0 ? (
          materials.map((material) => (
            <Grid item xs={12} sm={6} md={4} key={material._id}>
              <Box
                className={`${theme.card} ${theme.shadow}`}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.name === 'dark' 
                      ? '0px 8px 20px rgba(0,0,0,0.4)' 
                      : '0px 8px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      backgroundColor: theme.name === 'dark' ? '#1E293B' : '#F8FAFC',
                      color: theme.name === 'dark' ? '#3B82F6' : '#3B82F6',
                      border: `1px solid ${theme.name === 'dark' ? '#334155' : '#E2E8F0'}`,
                    }}
                  >
                    {getFileIcon(material.fileType)}
                  </Box>
                  <Box>
                    <Typography fontWeight={600} fontSize="1rem" noWrap className={theme.text}>
                      {material.title}
                    </Typography>
                    <Typography variant="caption" className={theme.textMuted}>
                      {material.materialType.replace('_', ' ')} · Unit {material.unit}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="body2" sx={{ mt: 1, mb: 1 }} className={theme.textMuted} noWrap>
                  {material.description}
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" className={theme.textMuted}>
                    {material.uploadedBy?.name} ·{' '}
                    {new Date(material.uploadedAt).toLocaleDateString()}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      href={material.fileUrl}
                      target="_blank"
                      download
                      sx={{
                        color: theme.name === 'dark' ? '#3B82F6' : '#3B82F6',
                        '&:hover': {
                          backgroundColor: theme.name === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        }
                      }}
                    >
                      <Download />
                    </IconButton>
                    {isInstructorOrCA && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(material._id)}
                        sx={{
                          color: '#EF4444',
                          '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography align="center" className={theme.textMuted}>
              No materials uploaded yet.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth 
        disableEscapeKeyDown={loading}
        PaperProps={{
          sx: {
            backgroundColor: theme.name === 'dark' ? '#1E293B' : '#FFFFFF',
            color: theme.name === 'dark' ? '#F1F5F9' : '#1E293B',
            border: `1px solid ${theme.name === 'dark' ? '#334155' : '#E2E8F0'}`,
          }
        }}
      >
        <DialogTitle className={theme.text}>Add New Material</DialogTitle>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.name === 'dark' ? '#334155' : '#E2E8F0',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.name === 'dark' ? '#475569' : '#CBD5E1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3B82F6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.name === 'dark' ? '#94A3B8' : '#64748B',
                },
                '& .MuiInputBase-input': {
                  color: theme.name === 'dark' ? '#F1F5F9' : '#1E293B',
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.name === 'dark' ? '#334155' : '#E2E8F0',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.name === 'dark' ? '#475569' : '#CBD5E1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3B82F6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.name === 'dark' ? '#94A3B8' : '#64748B',
                },
                '& .MuiInputBase-input': {
                  color: theme.name === 'dark' ? '#F1F5F9' : '#1E293B',
                },
              }}
            />
            <TextField
              select
              fullWidth
              label="Material Type"
              value={formData.materialType}
              onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
              margin="normal"
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.name === 'dark' ? '#334155' : '#E2E8F0',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.name === 'dark' ? '#475569' : '#CBD5E1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3B82F6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.name === 'dark' ? '#94A3B8' : '#64748B',
                },
                '& .MuiInputBase-input': {
                  color: theme.name === 'dark' ? '#F1F5F9' : '#1E293B',
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.name === 'dark' ? '#334155' : '#E2E8F0',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.name === 'dark' ? '#475569' : '#CBD5E1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3B82F6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.name === 'dark' ? '#94A3B8' : '#64748B',
                },
                '& .MuiInputBase-input': {
                  color: theme.name === 'dark' ? '#F1F5F9' : '#1E293B',
                },
              }}
            />
            <Button
              variant="outlined"
              component="label"
              sx={{ 
                mt: 2, 
                width: '100%',
                borderColor: theme.name === 'dark' ? '#334155' : '#E2E8F0',
                color: theme.name === 'dark' ? '#F1F5F9' : '#1E293B',
                '&:hover': {
                  borderColor: theme.name === 'dark' ? '#475569' : '#CBD5E1',
                  backgroundColor: theme.name === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                }
              }}
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
              <Typography variant="caption" display="block" sx={{ mt: 1 }} className={theme.textMuted}>
                Selected file: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            sx={{
              color: theme.name === 'dark' ? '#F1F5F9' : '#1E293B',
              '&:hover': {
                backgroundColor: theme.name === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.title || !selectedFile}
            sx={{
              backgroundColor: '#3B82F6',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1E40AF',
              },
              '&:disabled': {
                backgroundColor: theme.name === 'dark' ? '#64748B' : '#94A3B8',
              }
            }}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaterialsTab;
