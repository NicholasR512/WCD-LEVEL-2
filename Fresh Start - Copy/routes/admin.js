const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');
const Job = require('../models/job');
const Message = require('../models/message');

// Admin dashboard (view all jobs)
router.get('/', ensureAuthenticated, ensureRole('Admin'), async (req, res) => {
    try {
        const jobs = await Job.find();
        res.render('admin/index', { jobs });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.redirect('/');
    }
});

// Approve a job
router.post('/jobs/:id/approve', ensureAuthenticated, ensureRole('Admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).send('Job not found');
        }
        job.status = 'Approved';
        await job.save();
        res.redirect('/admin');
    } catch (err) {
        console.error('Error approving job:', err);
        res.redirect('/admin');
    }
});

// Delete a message (Admin only)
router.delete('/messages/:id', ensureAuthenticated, ensureRole(['Admin']), async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            console.error(`Message with ID ${req.params.id} not found.`);
            req.flash('error', 'Message not found.');
            return res.redirect('/admin/messages');
        }
        await message.deleteOne();
        req.flash('success', 'Message deleted successfully!');
        res.redirect('/admin/messages');
    } catch (err) {
        console.error('Error deleting message:', err);
        req.flash('error', 'Failed to delete the message.');
        res.redirect('/admin/messages');
    }
});




// Delete a job
router.delete('/jobs/:id', ensureAuthenticated, ensureRole('Admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            console.error(`Job with ID ${req.params.id} not found.`);
            return res.redirect('/admin');
        }
        await job.deleteOne();
        res.redirect('/admin');
    } catch (err) {
        console.error('Error deleting job:', err);
        res.redirect('/admin');
    }
});

// View all messages (Admin only)
router.get('/messages', ensureAuthenticated, ensureRole(['Admin']), async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 }); // Fetch all messages
        res.render('admin/messages', { messages });
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.redirect('/');
    }
});

module.exports = router;

