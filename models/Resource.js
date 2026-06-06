const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientName: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true },
    resourceTier: { type: String, required: true, enum: ['Standard', 'Premium', 'Enterprise'] }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);