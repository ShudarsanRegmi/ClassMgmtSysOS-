import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Paper,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Tooltip
} from '@mui/material';
import { 
  EmojiEvents as Trophy,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const RankCard = ({ student, rank, photoUrl, onEdit, onDelete, isCR }) => {
  const theme = useTheme();

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return theme.palette.warning.main;
      case 2:
        return theme.palette.grey[400];
      case 3:
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Card 
      elevation={6}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        borderRadius: 4,
        background: 'linear-gradient(145deg, #f0f0f3, #cacaca)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
        }
      }}
    >
      {isCR && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
          <Tooltip title="Edit">
            <IconButton 
              onClick={() => onEdit({ student, rank, photoUrl })}
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)',
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              onClick={() => onDelete({ student, rank })}
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)',
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Box
        sx={{
          position: 'absolute',
          top: -24,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: getRankColor(rank),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1
        }}
      >
        <Trophy fontSize="small" />
      </Box>
      
      <CardContent sx={{ pt: 6, textAlign: 'center', px: 3 }}>
        <Avatar
          src={photoUrl}
          alt={student.name}
          sx={{
            width: 96,
            height: 96,
            mx: 'auto',
            mb: 2,
            border: `5px solid ${getRankColor(rank)}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
          }}
        />
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {student.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Roll No: {student.rollNo}
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            mt: 2,
            color: getRankColor(rank),
            fontWeight: 700,
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          {rank === 1 ? '🥇 1st' : rank === 2 ? '🥈 2nd' : '🥉 3rd'}
        </Typography>
      </CardContent>
    </Card>
  );
};

const HonorList = ({ honors, isCR, onUpdate, onDelete }) => {
  const theme = useTheme();
  const [editDialog, setEditDialog] = useState(false);
  const [selectedHonor, setSelectedHonor] = useState(null);
  const [editedRank, setEditedRank] = useState('');

  const honorsByRank = honors.reduce((acc, honor) => {
    if (!acc[honor.rank]) {
      acc[honor.rank] = [];
    }
    acc[honor.rank].push(honor);
    return acc;
  }, {});

  const handleEdit = (honor) => {
    setSelectedHonor(honor);
    setEditedRank(honor.rank);
    setEditDialog(true);
  };

  const handleDelete = (honor) => {
    if (window.confirm('Are you sure you want to remove this student from the honor list?')) {
      onDelete(honor);
    }
  };

  const handleSave = () => {
    if (selectedHonor && editedRank) {
      onUpdate({
        ...selectedHonor,
        rank: parseInt(editedRank)
      });
      setEditDialog(false);
    }
  };

  return (
  <>
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 5,
        borderRadius: 4,
        backgroundColor: '#1E293B', // background.medium
        border: '1px solid #334155', // border.soft
        backdropFilter: 'blur(6px)',
      }}
    >
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: '#F1F5F9', // text.base
          mb: 4
        }}
      >
        🏆 Honor Board — Semester Rank Holders
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {[1, 2, 3].map((rank) => (
          <Grid item xs={12} sm={6} md={4} key={rank}>
            {honorsByRank[rank]?.map((honor) => (
              <RankCard
                key={honor._id}
                student={honor.student}
                rank={rank}
                photoUrl={honor.photoUrl}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isCR={isCR}
              />
            ))}
          </Grid>
        ))}
      </Grid>
    </Paper>

    <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
      <DialogTitle>Edit Rank</DialogTitle>
      <DialogContent>
        <TextField
          select
          fullWidth
          label="New Rank"
          value={editedRank}
          onChange={(e) => setEditedRank(e.target.value)}
          sx={{ mt: 2 }}
        >
          {[1, 2, 3].map((rank) => (
            <MenuItem key={rank} value={rank}>
              {rank === 1 ? '🥇 1st' : rank === 2 ? '🥈 2nd' : '🥉 3rd'}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditDialog(false)}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#3B82F6', color: 'white' }}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  </>
);

    
};

export default HonorList;
