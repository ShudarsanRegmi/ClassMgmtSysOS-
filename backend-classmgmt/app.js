const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes')
const fileRoutes = require('./routes/fileRoutes');
// I could not understand, why not having this is making firebause auth to fail although it's not being used
const admin = require('./firebaseAdmin');
const crRoutes = require('./routes/crRoutes');
const classRoutes = require('./routes/classRoutes');
const semesterRoutes = require('./routes/semesterRoutes');
const courseRoutes = require('./routes/courseRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const settingsRoutes = require('./routes/systemSettingsRoutes');
const assignmentRoutes = require('./routes/courseAssignment');
const noticeRoutes = require('./routes/noticeRoutes');
const courseMaterialRoutes = require('./routes/courseMaterialRoutes');
const connectDB = require('./config/db');
const eventRoutes = require('./routes/event.routes');
const path = require('path');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerOptions");


const cors = require('cors');

const dotenv = require('dotenv');
require('dotenv').config();


// Connect to DB
connectDB();


const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// swagger api configuration
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Later it might be mapped to : /api/user
app.use('/api/', userRouter); 
app.use('/api/files/', fileRoutes);
app.use('/api/cr', crRoutes);
app.use('/api/class', classRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/sem', semesterRoutes);
app.use('/api/notices', noticeRoutes);  
app.use('/api/materials', courseMaterialRoutes); // courseRoute was used instead of this..

app.use('/api/faculty', facultyRoutes);
app.use('/api/assignments/', assignmentRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/events', eventRoutes);

// Set up the default route or any other necessary routes
app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
