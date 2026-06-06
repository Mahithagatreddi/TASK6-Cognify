const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true }
});

// Structural Hook: Intercept saving pipeline to salt and encrypt text passwords automatically
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const securitySalt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, securitySalt);
    next();
});

module.exports = mongoose.model('User', UserSchema);