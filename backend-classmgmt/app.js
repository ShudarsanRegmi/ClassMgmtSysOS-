const express = require('express');
const bodyParser = require('body-parser');
const admin = require('./firebaseAdmin');

const connectDB = require('./config/db');

const cors = require('cors');

const dotenv = require('dotenv');
require('dotenv').config();

// Connect to DB
connectDB();

const verifyToken = require('./middleware/authmiddleware'); // Todo: To confirm that this modularization works fine

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});