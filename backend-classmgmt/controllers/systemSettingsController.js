const SystemSettings = require('../models/SystemSettings');

// Get current settings
const getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne().populate('currentSemester');
    if (!settings) return res.status(404).json({ message: "Settings not found" });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update or create settings
const updateSettings = async (req, res) => {
  const { currentSemester, academicYear } = req.body;

  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings({ currentSemester, academicYear });
    } else {
      settings.currentSemester = currentSemester;
      settings.academicYear = academicYear;
      settings.updatedAt = Date.now();
    }

    await settings.save();
    res.json({ message: 'Settings updated', settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {getSettings, updateSettings};