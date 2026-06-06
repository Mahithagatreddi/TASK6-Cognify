module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.session && req.session.userId) {
            return next(); // Token verification validated successfully
        }
        
        // Handle request block based on invocation context
        if (req.headers['accept'] && req.headers['accept'].includes('application/json')) {
            return res.status(401).json({ success: false, error: "Access Denied: Please log into the network system first." });
        }
        res.redirect('/login');
    }
};