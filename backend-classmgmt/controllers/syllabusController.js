const Syllabus = require('../models/Syllabus');
const User = require('../models/User');
const Class = require('../models/Class');
const uploadToCloudinary = require('../utils/cloudinaryUploader');
const fs = require('fs').promises;
const path = require('path');
const { handleError } = require('../utils/errorHandler');

// Helper function to handle file upload
const handleFileUpload = async (file, folder = 'syllabus') => {
    try {
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../temp');
        await fs.mkdir(tempDir, { recursive: true });

        // Save file temporarily
        const tempFilePath = path.join(tempDir, file.originalname);
        await fs.writeFile(tempFilePath, file.buffer);

        // Upload to Cloudinary
        const result = await uploadToCloudinary(tempFilePath, folder);

        // Clean up temp file
        await fs.unlink(tempFilePath);

        return result.secure_url;
    } catch (error) {
        throw new Error('File upload failed: ' + error.message);
    }
};

// Get syllabus for a course
const getSyllabus = async (req, res) => {
    try {
        const { courseId, semesterId } = req.params;
        const { user } = req;

        // Get user's class
        const userDetails = await User.findOne({ uid: user.uid });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        const classDetails = await Class.findOne({ classId: userDetails.classId });
        if (!classDetails) {
            return res.status(404).json({ message: "Class not found" });
        }

        const syllabus = await Syllabus.findOne({
            courseId,
            semesterId,
            classId: classDetails.classId
        }).populate('uploadedBy', 'name email photoUrl');

        res.status(200).json({
            success: true,
            data: syllabus || { files: [] }
        });

    } catch (error) {
        handleError(res, error);
    }
};

// Upload syllabus images
const uploadSyllabusImages = async (req, res) => {
    try {
        const { courseId, semesterId } = req.params;
        const { user } = req;

        // Get user's class
        const userDetails = await User.findOne({ uid: user.uid });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        const classDetails = await Class.findOne({ classId: userDetails.classId });
        if (!classDetails) {
            return res.status(404).json({ message: "Class not found" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        // Upload all files to Cloudinary
        const uploadPromises = req.files.map(file => handleFileUpload(file, 'syllabus'));
        const fileUrls = await Promise.all(uploadPromises);
        
        const fileObjs = fileUrls.map((url, idx) => ({
            url,
            type: req.files[idx].mimetype
        }));

        // Find existing syllabus or create new one
        let syllabus = await Syllabus.findOne({
            courseId,
            semesterId,
            classId: classDetails.classId
        });

        if (syllabus) {
            // Add new files to existing syllabus
            syllabus.files.push(...fileObjs);
            syllabus.updatedAt = new Date();
        } else {
            // Create new syllabus
            syllabus = new Syllabus({
                courseId,
                semesterId,
                classId: classDetails.classId,
                files: fileObjs,
                uploadedBy: userDetails._id
            });
        }

        await syllabus.save();
        await syllabus.populate('uploadedBy', 'name email photoUrl');

        res.status(201).json({
            success: true,
            data: syllabus
        });

    } catch (error) {
        handleError(res, error);
    }
};

// Update a specific syllabus file (replace image)
const updateSyllabusFile = async (req, res) => {
    try {
        const { courseId, semesterId, fileId } = req.params;
        const { user } = req;

        // Get user's class
        const userDetails = await User.findOne({ uid: user.uid });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        const classDetails = await Class.findOne({ classId: userDetails.classId });
        if (!classDetails) {
            return res.status(404).json({ message: "Class not found" });
        }

        const syllabus = await Syllabus.findOne({
            courseId,
            semesterId,
            classId: classDetails.classId
        });

        if (!syllabus) {
            return res.status(404).json({ message: 'Syllabus not found' });
        }

        const fileIndex = syllabus.files.findIndex(f => f._id.toString() === fileId);
        if (fileIndex === -1) {
            return res.status(404).json({ message: 'Syllabus file not found' });
        }

        // Replace the image if a new file is uploaded
        if (req.file) {
            const fileUrl = await handleFileUpload(req.file, 'syllabus');
            syllabus.files[fileIndex].url = fileUrl;
            syllabus.files[fileIndex].type = req.file.mimetype;
            syllabus.files[fileIndex].uploadedAt = new Date();
        }

        syllabus.updatedAt = new Date();
        await syllabus.save();
        await syllabus.populate('uploadedBy', 'name email photoUrl');

        res.status(200).json({
            success: true,
            data: syllabus
        });

    } catch (error) {
        handleError(res, error);
    }
};

// Delete a specific syllabus file
const deleteSyllabusFile = async (req, res) => {
    try {
        const { courseId, semesterId, fileId } = req.params;
        const { user } = req;

        // Get user's class
        const userDetails = await User.findOne({ uid: user.uid });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        const classDetails = await Class.findOne({ classId: userDetails.classId });
        if (!classDetails) {
            return res.status(404).json({ message: "Class not found" });
        }

        const syllabus = await Syllabus.findOne({
            courseId,
            semesterId,
            classId: classDetails.classId
        });

        if (!syllabus) {
            return res.status(404).json({ message: 'Syllabus not found' });
        }

        const fileIndex = syllabus.files.findIndex(f => f._id.toString() === fileId);
        if (fileIndex === -1) {
            return res.status(404).json({ message: 'Syllabus file not found' });
        }

        // Remove the file
        syllabus.files.splice(fileIndex, 1);
        syllabus.updatedAt = new Date();

        // If no files remain, delete the entire syllabus document
        if (syllabus.files.length === 0) {
            await Syllabus.deleteOne({ _id: syllabus._id });
            return res.status(200).json({
                success: true,
                message: 'Syllabus file deleted and syllabus removed (no files left)',
                data: { files: [] }
            });
        } else {
            await syllabus.save();
            await syllabus.populate('uploadedBy', 'name email photoUrl');
            return res.status(200).json({
                success: true,
                message: 'Syllabus file deleted',
                data: syllabus
            });
        }

    } catch (error) {
        handleError(res, error);
    }
};

// Delete entire syllabus
const deleteSyllabus = async (req, res) => {
    try {
        const { courseId, semesterId } = req.params;
        const { user } = req;

        // Get user's class
        const userDetails = await User.findOne({ uid: user.uid });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        const classDetails = await Class.findOne({ classId: userDetails.classId });
        if (!classDetails) {
            return res.status(404).json({ message: "Class not found" });
        }

        const syllabus = await Syllabus.findOneAndDelete({
            courseId,
            semesterId,
            classId: classDetails.classId
        });

        if (!syllabus) {
            return res.status(404).json({ message: 'Syllabus not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Syllabus deleted successfully'
        });

    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getSyllabus,
    uploadSyllabusImages,
    updateSyllabusFile,
    deleteSyllabusFile,
    deleteSyllabus
}; 