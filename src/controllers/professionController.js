const Profession = require('../models/Profession');

// @desc    Get all professions
// @route   GET /api/professions
// @access  Public
const getProfessions = async (req, res) => {
    try {
        const professions = await Profession.find().select('name category slug -_id').sort({ category: 1, name: 1 });
        res.status(200).json({
            success: true,
            count: professions.length,
            data: professions
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
    getProfessions
};
