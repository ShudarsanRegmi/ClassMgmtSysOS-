// const admin = require('firebase-admin'); // ensure this is initialized in your config

// const verifyToken = async (req, res, next) => {
//   const idToken = req.headers.authorization;
//   console.log("verifying token");
//   console.log(idToken);

//   if (!idToken) {
//     return res.status(401).send('Unauthorized');
//   }

//   try {
//     console.log("Decoded Token");
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     console.log(decodedToken)
//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     console.error('Token verification failed:', error.message);
//     return res.status(401).send('Unauthorized');
//   }
// };

// I've changed the split logic here.. so I may need to handle the side effect..

const admin = require('firebase-admin'); // Ensure admin.initializeApp() is called somewhere in your config

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized - Missing or Invalid Authorization Header');
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // console.log('Decoded Token:', decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).send('Unauthorized - Token Verification Failed');
  }
};

module.exports = verifyToken;
