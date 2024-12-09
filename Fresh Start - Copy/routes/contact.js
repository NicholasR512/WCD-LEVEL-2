const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');
const Message = require('../models/message'); // Import the Message model

// Contact route (accessible to Students only)
router.get('/', ensureAuthenticated, ensureRole(['Student']), (req, res) => {
    res.render('contact', { user: req.user });
});

router.post('/', ensureAuthenticated, ensureRole(['Student']), async (req, res) => {
    const { subject, message } = req.body;

    try {
        // Save the message to the database
        await Message.create({
            userEmail: req.user.email,
            subject,
            message,
        });

        req.flash('success', 'Your message has been sent successfully!');
        res.redirect('/contact');
    } catch (err) {
        console.error('Error saving message:', err);
        req.flash('error', 'Failed to send your message. Please try again later.');
        res.redirect('/contact');
    }
});

const nodemailer = require('nodemailer');

router.post('/', ensureAuthenticated, ensureRole(['Student']), async (req, res) => {
    const { subject, message } = req.body;

    try {
        // Configure the transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Configure the email
        const mailOptions = {
            from: req.user.email,
            to: 'resslern321@gmail.com', // Replace with your support email
            subject: `Contact Form: ${subject}`,
            text: `From: ${req.user.email}\n\nMessage:\n${message}`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        req.flash('success', 'Your message has been sent successfully!');
        res.redirect('/contact');
    } catch (err) {
        console.error('Error sending email:', err);
        req.flash('error', 'Failed to send your message. Please try again later.');
        res.redirect('/contact');
    }
});


module.exports = router;
