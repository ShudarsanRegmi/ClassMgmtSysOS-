const cloudinary = require('cloudinary').v2;

const uploadToCloudinary = async (localFilePath, folder = 'classmgmt') => {
    try {
        const result = await cloudinary.uploader.upload(localFilePath, { folder });
        return result;
    } catch (err) {
        throw new Error('Cloudinary Upload Failed: ' + err.message);
    }
};

module.exports = uploadToCloudinary;