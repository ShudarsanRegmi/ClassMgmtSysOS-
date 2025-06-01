const {
    Deadline,
    Syllabus,
    CourseMaterial,
    SharedNote,
    WhiteboardShot
} = require('../models/CourseMaterial');
const User = require('../models/User');
const Class = require('../models/Class');

// Helper function to handle errors
const handleError = (res, error) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
    });
};

// Get all materials for a course
const getCourseMaterials = async (req, res) => {
    try {
        const { courseId, semesterId } = req.params;
        const { type } = req.query;
        const { user } = req; // From auth middleware

        // Get user's class
        const userDetails = await User.findOne({ uid: user.uid });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get class details using classId string
        const classDetails = await Class.findOne({ classId: userDetails.classId });
        if (!classDetails) {
            return res.status(404).json({ message: "Class not found" });
        }

        let materials;
        const query = { 
            courseId,
            semesterId,
            classId: classDetails._id
        };

        switch (type) {
            case 'deadlines':
                materials = await Deadline.find(query)
                    .populate('uploadedBy', 'name email photoUrl')
                    .sort({ dueDate: 1 });
                break;
            case 'syllabus':
                materials = await Syllabus.findOne(query)
                    .populate('uploadedBy', 'name email photoUrl');
                break;
            case 'materials':
                materials = await CourseMaterial.find(query)
                    .populate('uploadedBy', 'name email photoUrl')
                    .sort({ uploadedAt: -1 });
                break;
            case 'notes':
                materials = await SharedNote.find(query)
                    .populate('uploadedBy', 'name email photoUrl')
                    .populate('likes', 'name')
                    .sort({ uploadedAt: -1 });
                break;
            case 'whiteboard':
                materials = await WhiteboardShot.find(query)
                    .populate('uploadedBy', 'name email photoUrl')
                    .sort({ lectureDate: -1 });
                break;
            default:
                // Get all types of materials
                const [deadlines, syllabus, courseMaterials, notes, whiteboardShots] = await Promise.all([
                    Deadline.find(query).populate('uploadedBy', 'name email photoUrl'),
                    Syllabus.findOne(query).populate('uploadedBy', 'name email photoUrl'),
                    CourseMaterial.find(query).populate('uploadedBy', 'name email photoUrl'),
                    SharedNote.find(query).populate('uploadedBy', 'name email photoUrl').populate('likes', 'name'),
                    WhiteboardShot.find(query).populate('uploadedBy', 'name email photoUrl')
                ]);

                materials = {
                    deadlines,
                    syllabus,
                    courseMaterials,
                    notes,
                    whiteboardShots
                };
        }

        res.status(200).json({
            success: true,
            data: materials
        });

    } catch (error) {
        handleError(res, error);
    }
};

// Upload new material
const uploadMaterial = async (req, res) => {
    try {
        const { type, courseId } = req.params;
        const { user } = req;
        const materialData = {
            ...req.body,
            uploadedBy: user.uid,
            courseId
        };

        let material;
        switch (type) {
            case 'deadline':
                material = new Deadline(materialData);
                break;
            case 'syllabus':
                material = new Syllabus(materialData);
                break;
            case 'material':
                material = new CourseMaterial(materialData);
                break;
            case 'note':
                material = new SharedNote(materialData);
                break;
            case 'whiteboard':
                material = new WhiteboardShot(materialData);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid material type'
                });
        }

        await material.save();
        
        // Populate the uploadedBy field before sending response
        await material.populate('uploadedBy', 'name email photoUrl');
        
        res.status(201).json({
            success: true,
            data: material
        });

    } catch (error) {
        handleError(res, error);
    }
};

// Update material
const updateMaterial = async (req, res) => {
    try {
        const { type, id, courseId } = req.params;
        const updateData = req.body;

        let Model;
        switch (type) {
            case 'deadline':
                Model = Deadline;
                break;
            case 'syllabus':
                Model = Syllabus;
                break;
            case 'material':
                Model = CourseMaterial;
                break;
            case 'note':
                Model = SharedNote;
                break;
            case 'whiteboard':
                Model = WhiteboardShot;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid material type'
                });
        }

        const material = await Model.findOneAndUpdate(
            { _id: id, courseId },
            updateData,
            { 
                new: true, 
                runValidators: true 
            }
        ).populate('uploadedBy', 'name email photoUrl');

        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        res.status(200).json({
            success: true,
            data: material
        });

    } catch (error) {
        handleError(res, error);
    }
};

// Delete material
const deleteMaterial = async (req, res) => {
    try {
        const { type, id, courseId } = req.params;

        let Model;
        switch (type) {
            case 'deadline':
                Model = Deadline;
                break;
            case 'syllabus':
                Model = Syllabus;
                break;
            case 'material':
                Model = CourseMaterial;
                break;
            case 'note':
                Model = SharedNote;
                break;
            case 'whiteboard':
                Model = WhiteboardShot;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid material type'
                });
        }

        const material = await Model.findOneAndDelete({ _id: id, courseId });

        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Material deleted successfully'
        });

    } catch (error) {
        handleError(res, error);
    }
};

// Toggle like on shared note
const toggleNoteLike = async (req, res) => {
    try {
        const { id, courseId } = req.params;
        const { user } = req;

        const note = await SharedNote.findOne({ _id: id, courseId });
        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        const likeIndex = note.likes.indexOf(user.uid);
        if (likeIndex === -1) {
            note.likes.push(user.uid);
        } else {
            note.likes.splice(likeIndex, 1);
        }

        await note.save();
        await note.populate('uploadedBy', 'name email photoUrl');
        await note.populate('likes', 'name');

        res.status(200).json({
            success: true,
            data: note
        });

    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getCourseMaterials,
    uploadMaterial,
    updateMaterial,
    deleteMaterial,
    toggleNoteLike
}; 