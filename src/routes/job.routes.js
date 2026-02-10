const express = require('express');
const router = express.Router();
const {
    createJob,
    getAllJobs,
    updateJob,
    deleteJob,
    toggleJobStatus
} = require('../controllers/job.controller');
const { protectCompany } = require('../middleware/companyAuth.middleware');

// Public route to get all active jobs
router.get('/', getAllJobs);

// Protected routes (Company only)
router.post('/', protectCompany, createJob);
router.put('/:id', protectCompany, updateJob);
router.delete('/:id', protectCompany, deleteJob);
router.patch('/:id/status', protectCompany, toggleJobStatus);

module.exports = router;
