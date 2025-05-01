const admin = require('firebase-admin'); // ensure this is initialized in your config

const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization;

  if (!idToken) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).send('Unauthorized');
  }
};

module.exports = verifyToken;
