const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Company)
const createJob = async (req, res) => {
    try {
        // 1. Check if company is in Australia (CRITICAL REQUIREMENT)
        if (req.company.location.country.trim().toLowerCase() !== 'australia') {
            return res.status(403).json({
                success: false,
                message: 'Only companies located in Australia can post jobs.'
            });
        }

        const { title, category, jobType, location, salary, experience, description, skills, visaSponsorship } = req.body;

        const job = await Job.create({
            title,
            category,
            jobType,
            location,
            salary,
            experience,
            description,
            skills,
            visaSponsorship,
            companyId: req.company._id
        });

        res.status(201).json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get jobs for logged in company
// @route   GET /api/company/jobs
// @access  Private (Company)
const getCompanyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ companyId: req.company._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get all active jobs (Public)
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
    try {
        // Only return active jobs
        const jobs = await Job.find({ status: 'active' })
            .populate('companyId', 'companyName location logo') // Populate basic company info if needed
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Company)
const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Make sure user is job owner
        if (job.companyId.toString() !== req.company.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this job' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Company)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Make sure user is job owner
        if (job.companyId.toString() !== req.company.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Toggle job status (active/paused/closed)
// @route   PATCH /api/jobs/:id/status
// @access  Private (Company)
const toggleJobStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job.companyId.toString() !== req.company.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        if (!['active', 'paused', 'closed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        job.status = status;
        await job.save();

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = {
    createJob,
    getCompanyJobs,
    getAllJobs,
    updateJob,
    deleteJob,
    toggleJobStatus
};
