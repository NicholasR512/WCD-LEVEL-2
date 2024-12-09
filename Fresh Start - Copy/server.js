if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Initiates downloaded node features
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const session = require('express-session'); // Import session middleware
const mongoose = require('mongoose');
const User = require('./models/user');
const contactRoute = require('./routes/contact')

// Initiate routers
const indexRouter = require('./routes/index');
const jobRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Use middleware
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

// Initiate and connect to mongoose and MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB!'));

// Passport Configuration
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) return done(null, false, { message: 'No user with that email' });
        if (!(await user.isValidPassword(password))) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Session Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret', // Fallback for development
        resave: false,
        saveUninitialized: false,
    })
);

// Flash Messages Middleware
app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global Variables Middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // Add the logged-in user to locals
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});

// Use routers
app.use('/', indexRouter);
app.use('/jobs', jobRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/contact', contactRoute);

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
