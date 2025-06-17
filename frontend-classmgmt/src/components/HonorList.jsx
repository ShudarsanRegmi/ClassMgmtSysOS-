import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Paper,
  useTheme
} from '@mui/material';
import { EmojiEvents as Trophy } from '@mui/icons-material';

const RankCard = ({ student, rank, photoUrl }) => {
  const theme = useTheme();

  console.log("student", student);
  
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
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out'
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: getRankColor(rank),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: 2
        }}
      >
        <Trophy />
      </Box>
      
      <CardContent sx={{ pt: 4, textAlign: 'center' }}>
        <Avatar
          src={photoUrl}
          alt={student.name}
          sx={{
            width: 100,
            height: 100,
            mx: 'auto',
            mb: 2,
            border: `4px solid ${getRankColor(rank)}`
          }}
        />
        <Typography variant="h6" gutterBottom>
          {student.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Roll No: {student.rollNo}
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            mt: 2,
            color: getRankColor(rank),
            fontWeight: 'bold'
          }}
        >
          {rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd'}
        </Typography>
      </CardContent>
    </Card>
  );
};

const HonorList = ({ honors }) => {
  const theme = useTheme();

  // Group honors by rank
  const honorsByRank = honors.reduce((acc, honor) => {
    if (!acc[honor.rank]) {
      acc[honor.rank] = [];
    }
    acc[honor.rank].push(honor);
    return acc;
  }, {});

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 4,
        background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
        color: 'white'
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Semester Rank Holders
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {[1, 2, 3].map((rank) => (
          <Grid item xs={12} md={4} key={rank}>
            <Box sx={{ mb: 2 }}>
              {honorsByRank[rank]?.map((honor) => (
                <Box key={honor._id} sx={{ mb: 2 }}>
                  <RankCard 
                    student={honor.student} 
                    rank={rank} 
                    photoUrl={honor.photoUrl}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default HonorList; 