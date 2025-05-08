// controllers/file.controller.js
const cloudinary = require('../utils/cloudinary'); // your Cloudinary config module
const File = require('../models/File');      // your Mongoose schema
const fs = require('fs');


// POST /api/files/upload
// const uploadFile = async (req, res) => {
//     console.log("backend received the file upload request")
//     try {
//         console.log(req);
//         if (!req.file) return res.status(400).json({ error: 'No file uploaded' });


//         const result = await cloudinary.uploader.upload(req.file.path, {
//             folder: 'clsasmgmt', // optional: helps organize files
//         });

//         const newFile = new File({
//             public_id: result.public_id,
//             url: result.secure_url,
//             original_name: req.file.originalname,
//         });

//         await newFile.save();

//         res.status(201).json({ message: 'File uploaded successfully', file: newFile });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Upload failed' });
//     }
// };

const uploadFile = async (req, res) => {
    console.log("Received file upload request");

    try {
        console.log("Request file object:", req.file);

        if (!req.file) {
            console.log("No file found in the request");
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'clsasmgmt'
        });

        console.log("Cloudinary upload result:", result);

        // Save file info to database
        const newFile = new File({
            public_id: result.public_id,
            url: result.secure_url,
            original_name: req.file.originalname
        });

        await newFile.save();

        // Clean up temp file
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            message: 'File uploaded successfully',
            file: newFile
        });
    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).json({ error: 'Upload failed' });
    }
};

// GET /api/files
const getAllFiles = async (req, res) => {
    try {
        const files = await File.find().sort({ createdAt: -1 });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch files' });
    }
};

// DELETE /api/files/:id
const deleteFileById = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ error: 'File not found' });

        await cloudinary.uploader.destroy(file.public_id);
        await file.deleteOne();

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Deletion failed' });
    }
};


module.exports = {uploadFile, getAllFiles, deleteFileById};