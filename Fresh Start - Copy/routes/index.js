// Initiates express and router
const express = require('express')
const router = express.Router()

// Gets and shows index page
router.get('/', async (req, res) => {
    res.render('index', { user: req.user });
});

module.exports = router