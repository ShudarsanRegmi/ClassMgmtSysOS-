const mongoose = require('mongoose');

const facultiesSchema = new mongoose.Schema({
    uid: {type: String, required: true},
    name: {type: String, required: true},
    email : {type: String, required: true},
    phone: {type: String, required: true},
    photoUrl: {type: String, default: null},
    role: {type: String, default: 'FACULTY'}, // Default role is FACULTY
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true // adds createdAt and updatedAt automatically
});


module.exports  = mongoose.model('Faculties', facultiesSchema);


// this was needed when faculty was not supposed to the auth user of hte application
// now as the requirement has changed, we need to remove this