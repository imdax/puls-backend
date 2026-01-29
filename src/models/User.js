const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Age is required']
    },
    country: {
        type: String,
        required: [true, 'Country of residence is required'],
        trim: true
    },
    profession: {
        type: String,
        required: [true, 'Profession is required'],
        trim: true
    }
}, {
    timestamps: true,
    strict: false // Allow future fields without strict schema validation if needed, though explicit fields are better
});

module.exports = mongoose.model('User', userSchema);
