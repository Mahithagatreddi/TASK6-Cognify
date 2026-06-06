const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Resource = require('./models/Resource');
const { ensureAuthenticated } = require('./middleware/auth');

const app = express();
const PORT = 3002;

// 1. Establish Secure Persistent MongoDB Pipe Mapping
mongoose.connect('mongodb://127.0.0.1:27017/cognifyz_auth_db')
    .then(() => console.log('🔌 Connected to MongoDB Security Engine Successfully.'))
    .catch(err => console.error('🚨 MongoDB Connection Fault Matrix:', err));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Configure State Memory Tracking Configurations
app.use(session({
    secret: 'cognifyz_cryptographic_signing_key_secret_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2, secure: false } // Session duration expires in 2 hours
}));

// ==================== UNPROTECTED VIEW ROUTES ====================
app.get('/register', (req, res) => res.render('register', { error: null }));
app.get('/login', (req, res) => res.render('login', { error: null }));
app.get('/', (req, res) => res.redirect('/login'));

// ==================== SECURITY COMPLIANCE AUTH CHANNELS ====================

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const missingMatch = await User.findOne({ $or: [{ email }, { username }] });
        
        if (missingMatch) {
            return res.render('register', { error: "Identity conflict: Username or Email string already logged." });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: "System registration error processing parameters." });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userFound = await User.findOne({ email });

        if (!userFound || !(await bcrypt.compare(password, userFound.password))) {
            return res.render('login', { error: "Security Exception: Invalid access combination keys." });
        }

        // Establish session mapping parameters
        req.session.userId = userFound._id;
        req.session.username = userFound.username;
        res.redirect('/dashboard');
    } catch (err) {
        res.render('login', { error: "Core backend pipeline authentication error." });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// ==================== PROTECTED CORE WORKSPACE CHANNELS ====================

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { username: req.session.username });
});

// [API READ CHANNELS] - Return only data owned by the current authenticated session user
app.get('/api/resources', ensureAuthenticated, async (req, res) => {
    try {
        const items = await Resource.find({ owner: req.session.userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, error: "Database reading parsing pipeline block." });
    }
});

// [API CREATE CHANNEL] - Inject database records tied to current session owner
app.post('/api/resources', ensureAuthenticated, async (req, res) => {
    try {
        const { clientName, contactEmail, resourceTier } = req.body;
        const newAsset = new Resource({
            owner: req.session.userId,
            clientName,
            contactEmail,
            resourceTier
        });
        await newAsset.save();
        res.status(201).json({ success: true, data: newAsset });
    } catch (err) {
        res.status(400).json({ success: false, error: "Validation parameters rejected by database engine constraints." });
    }
});

// [API DELETE CHANNEL] - Ensure secure asset deletion by owner
app.delete('/api/resources/:id', ensureAuthenticated, async (req, res) => {
    try {
        const targetingResult = await Resource.deleteOne({ _id: req.params.id, owner: req.session.userId });
        if (targetingResult.deletedCount === 0) {
            return res.status(404).json({ success: false, error: "Resource missing or security clearance mismatch." });
        }
        res.json({ success: true, message: "Asset entry permanently dropped from core database collections." });
    } catch (err) {
        res.status(500).json({ success: false, error: "Database transaction exception processing parameters." });
    }
});

app.listen(PORT, () => console.log(`\n🔒 Encrypted Database Node Operational on Port: http://localhost:${PORT}\n`));