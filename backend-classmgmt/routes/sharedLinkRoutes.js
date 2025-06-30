const express = require('express');
const router = express.Router();
const { createLink, getAllLinks } = require('../controllers/sharedLinkController');
const verifyToken = require('../middleware/authmiddleware');

router.post('/', verifyToken, createLink);
router.get('/', verifyToken, getAllLinks);

module.exports = router;
