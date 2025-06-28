const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Semester = require('../models/Semester');

// Load environment variables
dotenv.config();

const fixSemesterIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Get the collection
    const collection = mongoose.connection.collection('semesters');
    
    // Get all existing indexes
    const indexes = await collection.getIndexes();
    console.log('Current indexes:', Object.keys(indexes));

    // Check if there's a single field index on 'name'
    if (indexes.name_1) {
      console.log('Found conflicting single field index on name, dropping it...');
      await collection.dropIndex('name_1');
      console.log('Successfully dropped name_1 index');
    }

    // Ensure the compound indexes are created
    await Semester.createIndexes();
    console.log('Compound indexes created successfully');

    // Verify the indexes
    const newIndexes = await collection.getIndexes();
    console.log('Updated indexes:', Object.keys(newIndexes));

    console.log('Index fix completed successfully!');
  } catch (error) {
    console.error('Error fixing indexes:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the fix if this script is executed directly
if (require.main === module) {
  fixSemesterIndexes();
}

module.exports = fixSemesterIndexes; 