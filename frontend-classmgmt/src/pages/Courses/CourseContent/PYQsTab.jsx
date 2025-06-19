import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Avatar
} from '@mui/material';
import { Delete, CloudUpload, PictureAsPdf, Image } from '@mui/icons-material';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

const PYQsTab = ({ courseId, semesterId }) => {
  const { userProfile } = useAuth();
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [batch, setBatch] = useState('');
  const [year, setYear] = useState('');
  const [faculty, setFaculty] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchPyqs();
    // eslint-disable-next-line
  }, [courseId, semesterId]);

  const fetchPyqs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/pyqs/course/${courseId}/semester/${semesterId}`);
      setPyqs(res.data.pyqs);
    } catch (err) {
      setError('Failed to fetch PYQs');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!batch || !year || files.length === 0) {
      setError('Batch, year, and at least one file are required');
      return;
    }
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('course', courseId);
      formData.append('semester', semesterId);
      formData.append('batch', batch);
      formData.append('year', year);
      if (faculty) formData.append('faculty', faculty);
      files.forEach(f => formData.append('files', f));
      await api.post('/pyqs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('PYQ uploaded successfully!');
      setBatch('');
      setYear('');
      setFaculty('');
      setFiles([]);
      fileInputRef.current.value = '';
      fetchPyqs();
    } catch (err) {
      setError('Failed to upload PYQ');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (pyqId) => {
    if (!window.confirm('Delete this PYQ?')) return;
    try {
      await api.delete(`/pyqs/${pyqId}`);
      fetchPyqs();
    } catch (err) {
      setError('Failed to delete PYQ');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Previous Year Questions (PYQs)</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Upload PYQ</Typography>
        <form onSubmit={handleUpload}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                label="Batch"
                value={batch}
                onChange={e => setBatch(e.target.value)}
                fullWidth
                required
                placeholder="e.g. 2020-24"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Year"
                value={year}
                onChange={e => setYear(e.target.value)}
                fullWidth
                required
                type="number"
                placeholder="e.g. 2023"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Faculty (optional)"
                value={faculty}
                onChange={e => setFaculty(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
                disabled={uploading}
              >
                Select Files
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  multiple
                  hidden
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </Button>
              <Box sx={{ mt: 1 }}>
                {files.map((file, idx) => (
                  <Typography key={idx} variant="caption" display="block">
                    {file.name}
                  </Typography>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={18} /> : <CloudUpload />}
              >
                {uploading ? 'Uploading...' : 'Upload PYQ'}
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Paper>

      <Typography variant="h6" gutterBottom>All PYQs</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {pyqs.map(pyq => (
            <Paper key={pyq._id} sx={{ mb: 2, p: 2 }}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={<>
                    <b>Batch:</b> {pyq.batch} | <b>Year:</b> {pyq.year} {pyq.faculty && <>| <b>Faculty:</b> {pyq.faculty}</>}
                  </>}
                  secondary={<>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                      {pyq.files.map((file, idx) => (
                        <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer">
                          <Tooltip title={file.type === 'pdf' ? 'PDF' : 'Image'}>
                            <Avatar sx={{ bgcolor: file.type === 'pdf' ? 'error.main' : 'primary.main', width: 48, height: 48 }}>
                              {file.type === 'pdf' ? <PictureAsPdf /> : <Image />}
                            </Avatar>
                          </Tooltip>
                        </a>
                      ))}
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="textSecondary">
                        Uploaded by: {pyq.uploader?.name || 'Unknown'} | {new Date(pyq.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </>}
                />
                {(userProfile?._id === pyq.uploader?._id || userProfile?.role === 'CR') && (
                  <ListItemSecondaryAction>
                    <IconButton edge="end" color="error" onClick={() => handleDelete(pyq._id)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default PYQsTab; 