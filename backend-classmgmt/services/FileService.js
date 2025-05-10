// services/FileService.js
const File = require('../models/File');

const saveFileMetadata = async ({ public_id, url, original_name }) => {
  const file = new File({ public_id, url, original_name });
  await file.save();
  return file;
};

module.exports = { saveFileMetadata };
