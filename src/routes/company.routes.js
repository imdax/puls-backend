const express = require('express');
const router = express.Router();
const {
    registerCompany,
    loginCompany,
    getMe,
    updateCompanyProfile
} = require('../controllers/company.controller');
const { protectCompany } = require('../middleware/companyAuth.middleware');
const { getCompanyJobs } = require('../controllers/job.controller');

router.post('/register', registerCompany);
router.post('/login', loginCompany);
router.get('/me', protectCompany, getMe);
router.put('/update-profile', protectCompany, updateCompanyProfile);

// Company Dashboard API: Get jobs for the logged-in company
router.get('/jobs', protectCompany, getCompanyJobs);

module.exports = router;
