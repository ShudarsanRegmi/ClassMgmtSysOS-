const express = require('express');
const bodyParser = require('body-parser');
const admin = require('./firebaseAdmin');
const userRouter = require('./routes/userRoutes')
const fileRoutes = require('./routes/fileRoutes');
const crRoutes = require('./routes/crRoutes');
const classRoutes = require('./routes/classRoutes');
const semesterRoutes = require('./routes/semesterRoutes');
const courseRoutes = require('./routes/courseRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const settingsRoutes = require('./routes/systemSettingsRoutes');
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
app.use('/api/cr', crRoutes);
app.use('/api', classRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/sem', semesterRoutes);


app.use('/api/admin/faculty', facultyRoutes);
app.use('/api/admin/settings', settingsRoutes);

// Set up the default route or any other necessary routes
app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});