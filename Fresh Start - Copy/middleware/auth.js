function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/login');
}

function ensureRole(roles) {
    return (req, res, next) => {
        if (req.isAuthenticated() && roles.includes(req.user.role)) {
            return next();
        }
        res.status(403).send('Access Denied');
    };
}


module.exports = { ensureAuthenticated, ensureRole };
