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
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, ZoomIn as ZoomInIcon, Edit as EditIcon, Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const SyllabusTab = ({ syllabus = [], courseId, semesterId, onSyllabusUpdate }) => {
  const { user } = useAuth();
  const isCR = user?.role === 'CR' || user?.role === 'CA' || user?.role === 'FACULTY';
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [editFileId, setEditFileId] = useState(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedFiles([]);
  };
  const handleEditOpen = (file) => {
    setEditFileId(file._id);
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedFiles([]);
    setEditFileId(null);
  };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      setSelectedFiles(files);
    } else {
      alert('Please select image files');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFiles.length) {
      alert('Please select image files');
      return;
    }
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      selectedFiles.forEach(file => formDataToSend.append('files', file));
      const response = await api.post(
        `/syllabus/${courseId}/${semesterId}`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      onSyllabusUpdate(response.data.data.files);
      handleClose();
    } catch (error) {
      console.error('Error uploading syllabus:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      if (selectedFiles.length > 0) formDataToSend.append('file', selectedFiles[0]);
      const response = await api.put(
        `/syllabus/${courseId}/${semesterId}/${editFileId}`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      onSyllabusUpdate(response.data.data.files);
      handleEditClose();
    } catch (error) {
      console.error('Error updating syllabus file:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this syllabus image?')) return;
    setLoading(true);
    try {
      const response = await api.delete(`/syllabus/${courseId}/${semesterId}/${fileId}`);
      if (response.data.data) {
        onSyllabusUpdate(response.data.data.files);
      } else {
        onSyllabusUpdate([]);
      }
    } catch (error) {
      console.error('Error deleting syllabus file:', error);
    } finally {
      setLoading(false);
    }
  };
  const handlePreview = (file) => {
    setPreviewImage(file.url);
    setPreviewOpen(true);
  };
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Course Syllabus</Typography>
        {!isCR && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
            Upload Syllabus
          </Button>
        )}
      </Box>
      {syllabus.length > 0 ? (
        <Box display="flex" flexDirection="column" gap={4}>
          {syllabus.map((file) => (
            <Box key={file._id} sx={{ position: 'relative', width: '100%', maxWidth: 900, mx: 'auto' }}>
              <img
                src={file.url}
                alt="Syllabus Image"
                style={{
                  width: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  display: 'block',
                }}
                onClick={() => handlePreview(file)}
              />
              {/* Download icon at top-right */}
              <IconButton
                href={file.url}
                target="_blank"
                download
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  boxShadow: 1,
                  zIndex: 2,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                  p: 0.5
                }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
              {/* Edit/Delete icons for CR */}
              {!isCR && (
                <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1, zIndex: 2 }}>
                  <IconButton size="small" onClick={() => handleEditOpen(file)} sx={{ backgroundColor: 'rgba(255,255,255,0.85)', p: 0.5 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(file._id)} sx={{ backgroundColor: 'rgba(255,255,255,0.85)', p: 0.5 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px" bgcolor="grey.100" borderRadius={1}>
          <Typography color="textSecondary">No syllabus has been uploaded yet</Typography>
        </Box>
      )}
      {/* Upload Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Syllabus Images</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Button variant="outlined" component="label" sx={{ mt: 2, width: '100%' }}>
              Upload Syllabus Images
              <input type="file" hidden accept="image/*" multiple onChange={handleFileChange} />
            </Button>
            {selectedFiles.length > 0 && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected files: {selectedFiles.map(f => f.name).join(', ')}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading || !selectedFiles.length}>
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Replace Syllabus Image</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Button variant="outlined" component="label" sx={{ mt: 2, width: '100%' }}>
              Replace Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {selectedFiles.length > 0 && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected file: {selectedFiles[0].name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={loading || !selectedFiles.length}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="xl" fullWidth>
        <DialogContent>
          <img src={previewImage} alt="Course Syllabus" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button variant="contained" href={previewImage} target="_blank" download>Download</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SyllabusTab; 