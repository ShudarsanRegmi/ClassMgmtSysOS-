import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    IconButton,
    Link
} from '@mui/material';
import { Download, Description } from '@mui/icons-material';

const AssetCard = ({ asset }) => {
    const isImage = asset.fileType.startsWith('image/');

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {isImage ? (
                <CardMedia
                    component="img"
                    height="200"
                    image={asset.assetUrl}
                    alt={asset.title}
                    sx={{ objectFit: 'contain' }}
                />
            ) : (
                <Box
                    sx={{
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.100'
                    }}
                >
                    <Description sx={{ fontSize: 80, color: 'grey.500' }} />
                </Box>
            )}
            
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                    {asset.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    {asset.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                    {asset.semester.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                    Last updated: {new Date(asset.lastUpdated).toLocaleString()}
                </Typography>
            </CardContent>

            <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
                <Link href={asset.assetUrl} target="_blank" download>
                    <IconButton color="primary" aria-label="download file">
                        <Download />
                    </IconButton>
                </Link>
            </Box>
        </Card>
    );
};

export default AssetCard;
