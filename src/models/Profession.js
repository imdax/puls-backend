const mongoose = require('mongoose');

const professionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Profession name is required'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    category: {
        type: String,
        required: [true, 'Profession category is required'],
        trim: true
    }
}, {
    timestamps: true
});

// Middleware to create slug before saving
professionSchema.pre('save', function (next) {
    if (!this.isModified('name')) {
        next();
        return;
    }
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    next();
});

module.exports = mongoose.model('Profession', professionSchema);
