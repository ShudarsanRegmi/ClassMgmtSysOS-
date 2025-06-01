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
  Tooltip
} from '@mui/material';
import {
  Description,
  PictureAsPdf,
  VideoLibrary,
  Image,
  Download,
  Add
} from '@mui/icons-material';

const MaterialsTab = ({ materials }) => {
  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <PictureAsPdf color="error" />;
      case 'video':
        return <VideoLibrary color="primary" />;
      case 'image':
        return <Image color="success" />;
      default:
        return <Description color="action" />;
    }
  };

  const getMaterialTypeColor = (type) => {
    switch (type) {
      case 'LECTURE_NOTE':
        return 'primary';
      case 'PRESENTATION':
        return 'secondary';
      case 'REFERENCE':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Course Materials</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
        >
          Upload Material
        </Button>
      </Box>

      {materials?.length > 0 ? (
        <Grid container spacing={3}>
          {materials.map((material) => (
            <Grid item xs={12} sm={6} md={4} key={material._id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {getFileIcon(material.fileType)}
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                      {material.title}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {material.description}
                  </Typography>

                  <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                    <Chip
                      label={material.materialType.replace('_', ' ')}
                      size="small"
                      color={getMaterialTypeColor(material.materialType)}
                    />
                    <Chip
                      label={`Unit ${material.unit}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(material.uploadedAt).toLocaleDateString()}
                  </Typography>
                  <Tooltip title="Download">
                    <IconButton
                      size="small"
                      onClick={() => window.open(material.fileUrl, '_blank')}
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
            No materials have been uploaded for this course yet.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default MaterialsTab; 