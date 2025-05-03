const express = require('express');
const bodyParser = require('body-parser');
const admin = require('./firebaseAdmin');
const userRouter = require('./routes/userRoutes')
const fileRoutes = require('./routes/fileRoutes');
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

app.use('/api', userRouter); 
app.use('/api/files/', fileRoutes);


// Set up the default route or any other necessary routes
app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});