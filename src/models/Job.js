const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Please add a job category']
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Casual'],
        required: [true, 'Please add a job type']
    },
    location: {
        country: {
            type: String,
            required: [true, 'Please specify country']
        },
        city: {
            type: String,
            required: [true, 'Please specify city']
        },
        remote: {
            type: Boolean,
            default: false
        }
    },
    salary: {
        min: {
            type: Number
        },
        max: {
            type: Number
        },
        currency: {
            type: String,
            default: 'AUD'
        }
    },
    experience: {
        type: String,
        enum: ['No Experience', '1-3 Years', '3-5 Years', '5+ Years', 'Executive'],
        required: [true, 'Please specify experience level']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    skills: {
        type: [String],
        required: true
    },
    visaSponsorship: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'closed'],
        default: 'active'
    },
    companyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);
