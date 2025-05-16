/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Create a new class
 *     tags:
 *       - Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the class
 *               description:
 *                 type: string
 *                 description: Description of the class
 *     responses:
 *       201:
 *         description: Class created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /classHomepage/{uid}:
 *   get:
 *     summary: Get class homepage data
 *     tags:
 *       - Classes
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of students per page
 *     responses:
 *       200:
 *         description: Successfully retrieved class homepage data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classInfo:
 *                   type: object
 *                   description: Information about the class
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       photoUrl:
 *                         type: string
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *       404:
 *         description: User or class not found
 *       500:
 *         description: Server error
 */
// routes/classRoutes.js
const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const upload = require('../middleware/uploadMiddleware');



// /api/class/create - POST
// /api/class/delete - DELETE
// /api/class/getAllClasses - GET
router.post('/create', upload.single('photo'), classController.createClass);
router.delete('/delete/:classId', classController.deleteClassById); // Delete class by ID
router.get('/getAllClasses', classController.getAllClasses);




// GET class homepage data
router.get('/classHomepage/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const user = await User.findOne({ uid });

    if (!user || !user.classId) {
      return res.status(404).json({ error: 'User or class not found' });
    }

    const classInfo = await Class.findOne({ classId: user.classId })
      .populate('crs', 'name photoUrl')
      .populate('cas', 'name photoUrl');

    const students = await User.find({ classId: user.classId, role: 'student' })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('name photoUrl');

    const totalStudents = await User.countDocuments({ classId: user.classId, role: 'student' });

    res.json({
      classInfo,
      students,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
