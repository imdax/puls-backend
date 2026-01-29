const User = require('../models/User');
const Assessment = require('../models/Assessment');
const { evaluateUser } = require('../services/assessmentService');

// @desc    Start an assessment for a user
// @route   POST /api/assessment/start
// @access  Public
const startAssessment = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        // Find User
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Run Assessment Engine
        const evaluation = await evaluateUser(user);

        // Store Result
        const assessment = await Assessment.create({
            userId: user._id,
            status: evaluation.status,
            reasons: evaluation.reasons
        });

        res.status(201).json({
            success: true,
            data: {
                status: assessment.status,
                reasons: assessment.reasons,
                assessedAt: assessment.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    startAssessment
};
