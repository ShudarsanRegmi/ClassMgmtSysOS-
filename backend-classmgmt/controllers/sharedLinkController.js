const SharedLink = require('../models/SharedLinks');
const User = require('../models/User');
exports.createLink = async (req, res) => {
  try {
    const { title, description, url } = req.body;
    const user = await User.findOne({uid: req.user.uid});

    if(!user) {
        return res.status(404).json({message: 'User not found'});
    }
    const userid = user._id;
    console.log(userid);
    console.log(req.user)
    const newLink = new SharedLink({
      title,
      description,
      url,
      uploadedBy: userid
    });
    const saved = await newLink.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error saving link', error: err.message });
  }
};

exports.getAllLinks = async (req, res) => {
  try {
    const links = await SharedLink.find().populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching links', error: err.message });
  }
};
