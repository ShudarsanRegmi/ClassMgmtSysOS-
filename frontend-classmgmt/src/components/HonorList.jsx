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

const HonorList = ({ honors }) => {
  const theme = useTheme();

  const honorsByRank = honors.reduce((acc, honor) => {
    if (!acc[honor.rank]) {
      acc[honor.rank] = [];
    }
    acc[honor.rank].push(honor);
    return acc;
  }, {});

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        mb: 5,
        borderRadius: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
      }}
    >
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 600 }}>
        🏆 Semester Rank Holders
      </Typography>

      <Grid container spacing={4} sx={{ mt: 3, justifyContent: 'center' }}>
        {[1, 2, 3].map((rank) => (
          <Grid item xs={12} md={4} key={rank} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ mb: 3, width: '100%', maxWidth: 320 }}>
              {honorsByRank[rank]?.map((honor) => (
                <Box key={honor._id} sx={{ mb: 3 }}>
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
