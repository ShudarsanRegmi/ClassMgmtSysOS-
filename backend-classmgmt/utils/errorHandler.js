/**
 * Utility function to handle errors consistently across the application
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 */
const handleError = (res, error) => {
    console.error('Error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(error.errors).map(err => err.message)
        });
    }

    // Handle Mongoose cast errors (invalid ObjectId)
    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format',
            error: error.message
        });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate key error',
            error: error.message
        });
    }

    // Handle file upload errors
    if (error.message.includes('File upload failed')) {
        return res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error.message
        });
    }

    // Default error response
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
    });
};

module.exports = {
    handleError
}; 