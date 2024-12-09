const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userEmail: { type: String, required: true }, // Email of the student sending the message
    subject: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
