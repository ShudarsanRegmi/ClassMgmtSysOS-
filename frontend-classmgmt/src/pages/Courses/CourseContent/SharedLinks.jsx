import React, { useEffect, useState } from 'react';
import {
  Button, Card, CardContent, Typography, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions
} from '@mui/material';
import api from '../../../utils/api'; // your axios instance with interceptors

const SharedLinks = () => {
  const [links, setLinks] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', url: '' });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await api.get('/sharedlinks');
      setLinks(res.data);
    } catch (err) {
      console.error('Error fetching links:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post('/sharedlinks', form);
      fetchLinks(); // refresh the list
      setOpen(false);
      setForm({ title: '', description: '', url: '' });
    } catch (err) {
      console.error('Error submitting link:', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Shared Classroom Links</h1>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add New Link
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map(link => (
          <Card key={link._id} className="shadow-md hover:shadow-lg transition-all">
            <CardContent>
              <Typography variant="h6" className="font-semibold">{link.title}</Typography>
              <Typography variant="body2" className="text-gray-600">
                {link.description || 'No description provided.'}
              </Typography>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 mt-2 inline-block"
              >
                Visit Link
              </a>
              <Typography variant="caption" display="block" className="text-gray-500 mt-2">
                Uploaded by: {link.uploadedBy?.name || 'Anonymous'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add a New Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" name="title" label="Title" fullWidth
            variant="outlined" value={form.title} onChange={handleChange}
          />
          <TextField
            margin="dense" name="description" label="Description (optional)" fullWidth
            variant="outlined" value={form.description} onChange={handleChange}
          />
          <TextField
            margin="dense" name="url" label="URL" fullWidth
            variant="outlined" value={form.url} onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SharedLinks;
