const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        let { fullName, firstName, lastName, email, phone, age, country, profession, ...otherFields } = req.body;
        console.log('Received Registration Request:', req.body);

        // Handle firstName + lastName -> fullName
        if (!fullName && firstName && lastName) {
            fullName = `${firstName} ${lastName.trim()}`;
        }

        // Handle case mismatch or alias
        if (!fullName) {
            fullName = req.body.fullname || req.body.name;
        }

        // Basic Validation
        const missingFields = [];
        if (!fullName) missingFields.push('fullName (or firstName + lastName)');
        if (!email) missingFields.push('email');
        if (!phone) missingFields.push('phone');
        if (!age) missingFields.push('age');
        if (!country) missingFields.push('country');
        if (!profession) missingFields.push('profession');

        if (missingFields.length > 0) {
            console.log('Missing Fields:', missingFields);
            return res.status(400).json({ success: false, message: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Upsert user: Update if exists, Create if not
        // This handles "submission failed" on duplicate emails by simply updating the user's info
        const user = await User.findOneAndUpdate(
            { email },
            {
                fullName,
                email,
                phone,
                age,
                country,
                profession,
                ...otherFields
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            success: true,
            message: 'User registered successfully',
            data: {
                userId: user._id, // Frontend expects "userId"
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
        console.error('Registration Error:', error);
    }
};

module.exports = {
    registerUser
};
