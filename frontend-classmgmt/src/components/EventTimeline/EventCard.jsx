import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
    Typography,
    Chip,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    ImageList,
    ImageListItem
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Comment as CommentIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/event.service';
import toast from 'react-hot-toast';

export default function EventCard({ event, onEdit, onDelete, hasElevatedPrivileges }) {
    const { user } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [showGallery, setShowGallery] = useState(false);

    const isLiked = event.likes?.some(like => like.userId === user?.uid);
    const menuOpen = Boolean(anchorEl);

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Handle like toggle
    const handleLikeToggle = async () => {
        try {
            await eventService.toggleLike(event.id);
            // Optimistic update can be handled by parent component refresh
        } catch (error) {
            console.error('Error toggling like:', error);
            toast.error('Failed to update like');
        }
    };

    // Handle comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            await eventService.addComment(event.id, comment);
            setComment('');
            toast.success('Comment added');
            // Refresh handled by parent component
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        }
    };

    // Handle comment deletion
    const handleCommentDelete = async (commentId) => {
        try {
            await eventService.deleteComment(event.id, commentId);
            toast.success('Comment deleted');
            // Refresh handled by parent component
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };

    console.log("Event object in EventCard:", event); // Debug log
    console.log("Event id in EventCard:", event.id); // Debug log for specific id field

    return (
        <>
            <Card sx={{ maxWidth: 500, mb: 2 }}>
                {/* Card Header */}
                <CardHeader
                    avatar={
                        <Avatar src={event.postedBy?.photoUrl} alt={event.postedBy?.name}>
                            {event.postedBy?.name?.[0]}
                        </Avatar>
                    }
                    action={
                        hasElevatedPrivileges && (
                            <>
                                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={() => setAnchorEl(null)}
                                >
                                    <MenuItem onClick={() => {
                                        setAnchorEl(null);
                                        onEdit();
                                    }}>
                                        <EditIcon sx={{ mr: 1 }} /> Edit
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        console.log("Deleting event with id:", event.id); // Debug log before delete
                                        setAnchorEl(null);
                                        onDelete(event.id);
                                    }}>
                                        <DeleteIcon sx={{ mr: 1 }} /> Delete
                                    </MenuItem>
                                </Menu>
                            </>
                        )
                    }
                    title={event.title}
                    subheader={formatDate(event.date)}
                />

                {/* Event Image */}
                {event.images?.[0] && (
                    <CardMedia
                        component="img"
                        height="194"
                        image={event.images[0].url}
                        alt={event.title}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => setShowGallery(true)}
                    />
                )}

                {/* Content */}
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {event.caption}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {event.tags?.map(tag => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </CardContent>

                {/* Actions */}
                <CardActions disableSpacing>
                    <IconButton onClick={handleLikeToggle}>
                        {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {event.likeCount || 0}
                    </Typography>
                    <IconButton onClick={() => setShowComments(true)}>
                        <CommentIcon />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {event.commentCount || 0}
                    </Typography>
                </CardActions>
            </Card>

            {/* Comments Dialog */}
            <Dialog
                open={showComments}
                onClose={() => setShowComments(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Comments</DialogTitle>
                <DialogContent dividers>
                    {event.comments?.map(comment => (
                        <Box
                            key={comment._id}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                mb: 2,
                                gap: 1
                            }}
                        >
                            <Avatar
                                src={comment.userPhotoUrl}
                                alt={comment.userName}
                                sx={{ width: 32, height: 32 }}
                            >
                                {comment.userName[0]}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2">
                                    {comment.userName}
                                </Typography>
                                <Typography variant="body2">
                                    {comment.content}
                                </Typography>
                            </Box>
                            {(comment.userId === user?.uid || hasElevatedPrivileges) && (
                                <IconButton
                                    size="small"
                                    onClick={() => handleCommentDelete(comment._id)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                    <Box component="form" onSubmit={handleCommentSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowComments(false)}>Close</Button>
                    <Button onClick={handleCommentSubmit} disabled={!comment.trim()}>
                        Post
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Image Gallery Dialog */}
            <Dialog
                open={showGallery}
                onClose={() => setShowGallery(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Event Gallery</DialogTitle>
                <DialogContent>
                    <ImageList cols={2} gap={8}>
                        {event.images?.map((image, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={image.url}
                                    alt={image.caption || `Image ${index + 1}`}
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowGallery(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
} 