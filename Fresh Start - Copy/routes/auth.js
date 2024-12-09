const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// Register Page
router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body; // Add email here
    try {
        const user = new User({ username, email, password, role });
        await user.save();
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.render('auth/register', { errorMessage: 'Error creating account' });
    }
});


// Login Page
router.get('/login', (req, res) => {
    res.render('auth/login', { errorMessage: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

// Logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;
