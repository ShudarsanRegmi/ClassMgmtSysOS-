const express = require('express');
const bodyParser = require('body-parser');
const admin = require('./firebaseAdmin');

const cors = require('cors');

const dotenv = require('dotenv');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors());


async function verifyToken(req, res, next) {
    const idToken = req.headers.authorization;

    if(!idToken) {
        return res.status(401).send('Unauthorized'); 
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    }catch(error) {
        return res.status(401).send('Unauthorized');
    }
}


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});