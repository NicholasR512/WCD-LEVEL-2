// use mongoose
const mongoose = require('mongoose')

// database model for job
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    jobType: { type: String, enum: ['Part Time', 'Full Time'], required: true },
    city: { type: String, enum: ['Easton', 'Wilson', 'Bethlehem', 'Nazareth'], required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    requiredAge: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' }, // Approval status
    businessEmail: { type: String, required: true } // Business email for applications
});
module.exports = mongoose.model('Job', jobSchema);
