const multer = require('multer');
const storage = multer.memoryStorage(); // store in memory to send to Cloudinary
const upload = multer({ storage });

module.exports = upload;