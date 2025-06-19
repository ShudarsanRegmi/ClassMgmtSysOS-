const Pyq = require('../models/Pyq');
const { uploadToCloudinary } = require('../utils/cloudinaryUploader');
const fs = require('fs');

// Upload PYQ (multiple files)
exports.uploadPyq = async (req, res) => {
  try {
    const { course, semester, batch, year, faculty } = req.body;
    const uploader = req.user._id || req.user.id || req.user.uid;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const files = [];
    for (const file of req.files) {
      const isPdf = file.mimetype === 'application/pdf';
      const uploadResult = await uploadToCloudinary(file.path, isPdf ? 'pyqs/pdfs' : 'pyqs/images');
      files.push({
        url: uploadResult.secure_url,
        type: isPdf ? 'pdf' : 'image',
        publicId: uploadResult.public_id
      });
      fs.unlinkSync(file.path);
    }

    const pyq = new Pyq({
      course,
      semester,
      batch,
      year,
      faculty,
      files,
      uploader
    });
    await pyq.save();
    res.status(201).json({ pyq });
  } catch (error) {
    console.error('Error uploading PYQ:', error);
    res.status(500).json({ message: 'Error uploading PYQ' });
  }
};

// List all PYQs for a course/semester
exports.listPyqs = async (req, res) => {
  try {
    const { courseId, semesterId } = req.params;
    const pyqs = await Pyq.find({ course: courseId, semester: semesterId })
      .populate('uploader', 'name email')
      .sort({ createdAt: -1 });
    res.json({ pyqs });
  } catch (error) {
    console.error('Error listing PYQs:', error);
    res.status(500).json({ message: 'Error listing PYQs' });
  }
};

// Delete a PYQ
exports.deletePyq = async (req, res) => {
  try {
    const { pyqId } = req.params;
    const pyq = await Pyq.findById(pyqId);
    if (!pyq) return res.status(404).json({ message: 'PYQ not found' });
    // Delete files from cloudinary
    for (const file of pyq.files) {
      if (file.publicId) {
        await require('cloudinary').v2.uploader.destroy(file.publicId, { resource_type: file.type === 'pdf' ? 'raw' : 'image' });
      }
    }
    await pyq.deleteOne();
    res.json({ message: 'PYQ deleted' });
  } catch (error) {
    console.error('Error deleting PYQ:', error);
    res.status(500).json({ message: 'Error deleting PYQ' });
  }
}; 