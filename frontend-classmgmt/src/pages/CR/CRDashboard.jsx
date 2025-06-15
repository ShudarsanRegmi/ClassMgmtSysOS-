import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    IconButton,
    Dialog,
    AppBar,
    Toolbar,
    Slide,
    Button,
    useTheme,
    CardActionArea,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Close as CloseIcon,
    Class as ClassIcon,
    Upload as UploadIcon,
    Collections as CollectionsIcon,
    Book as BookIcon,
    Announcement as AnnouncementIcon,
    AccessTime as AccessTimeIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AssetCard from './compos/AssetCard';
import AssignedCourses from '../../components/AssignedCourses';
import SemesterAssetForm from '../../components/SemesterAssetForm';
import NoticeForm from '../../components/NoticeForm';
import CRDeadlineForm from '../../components/CRDeadlineForm';
import TimetableForm from '../../components/TimetableForm';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DashboardCard = styled(Card)(({ theme }) => ({
    height: '200px',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
    },
}));

const CRDashboard = () => {
    const [assets, setAssets] = useState([]);
    const { userProfile, availableSemesters } = useAuth();
    const theme = useTheme();

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);
    const [dialogTitle, setDialogTitle] = useState('');

    // Toast state
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchAssets();
    }, [userProfile]);

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setToast({ ...toast, open: false });
    };

    const showToast = (message, severity = 'success') => {
        setToast({
            open: true,
            message,
            severity
        });
    };

    const fetchAssets = async () => {
        try {
            const res = await api.get('/cr/semester-assets');
            setAssets(res.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const handleAssetUploadSuccess = () => {
        fetchAssets();
        handleCloseDialog();
    };

    const handleOpenDialog = (content, title) => {
        setDialogContent(content);
        setDialogTitle(title);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogContent(null);
        setDialogTitle('');
    };

    const handleNoticeSuccess = () => {
        handleCloseDialog();
    };

    const handleDeadlineSuccess = (deadline) => {
        handleCloseDialog();
    };

    const handleDeadlineError = (error) => {
        showToast(error.message || 'Failed to create deadline', 'error');
    };

    const dashboardSections = [
        {
            title: 'Create Notice',
            icon: <AnnouncementIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.info.main,
            onClick: () => handleOpenDialog(
                <NoticeForm onSubmitSuccess={handleNoticeSuccess} />,
                'Create Notice'
            ),
            description: 'Create and publish notices'
        },
        {
            title: 'Create Deadline',
            icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.warning.main,
            onClick: () => handleOpenDialog(
                <CRDeadlineForm 
                    onSubmitSuccess={handleDeadlineSuccess}
                    onError={handleDeadlineError}
                />,
                'Create Deadline'
            ),
            description: 'Create deadlines for assignments and exams'
        },
        {
            title: 'Update Timetable',
            icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.error.main,
            onClick: () => handleOpenDialog(
                <TimetableForm 
                    onSubmitSuccess={() => {
                        handleCloseDialog();
                        showToast('Timetable updated successfully');
                    }}
                    onError={error => showToast(error.message, 'error')}
                />,
                'Update Class Timetable'
            ),
            description: 'Update semester timetable'
        },
        {
            title: 'Assigned Courses',
            icon: <BookIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.primary.main,
            onClick: () => handleOpenDialog(<AssignedCourses />, 'Assigned Courses'),
            description: 'View and manage course assignments'
        },
        {
            title: 'Upload Asset',
            icon: <UploadIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.secondary.main,
            onClick: () => handleOpenDialog(
                <SemesterAssetForm 
                    onSubmitSuccess={handleAssetUploadSuccess}
                />,
                'Upload Semester Asset'
            ),
            description: 'Upload new semester assets'
        },
        {
            title: 'View Assets',
            icon: <CollectionsIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.success.main,
            onClick: () => handleOpenDialog(
                <Grid container spacing={3}>
                    {assets.map((asset) => (
                        <Grid item xs={12} sm={6} md={4} key={asset._id}>
                            <AssetCard asset={asset} />
                        </Grid>
                    ))}
                </Grid>,
                'Semester Assets'
            ),
            description: 'Browse uploaded semester assets'
        }
    ];

    return (
        <Box sx={{ p: 3, maxWidth: 'xl', mx: 'auto' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
                CR Dashboard
            </Typography>

            <Grid container spacing={4}>
                {dashboardSections.map((section, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <DashboardCard>
                            <CardActionArea
                                onClick={section.onClick}
                                sx={{ height: '100%' }}
                            >
                                <CardContent sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    gap: 2
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: `${section.color}15`,
                                        color: section.color,
                                        mb: 2
                                    }}>
                                        {section.icon}
                                    </Box>
                                    <Typography variant="h6" component="h2">
                                        {section.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {section.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </DashboardCard>
                    </Grid>
                ))}
            </Grid>

            {/* Full-screen dialog for content */}
            <Dialog
                fullScreen
                open={openDialog}
                onClose={handleCloseDialog}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleCloseDialog}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {dialogTitle}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ p: 3 }}>
                    {dialogContent}
                </Box>
            </Dialog>

            {/* Toast Notification */}
            <Snackbar
                open={toast.open}
                autoHideDuration={6000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseToast}
                    severity={toast.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CRDashboard;
