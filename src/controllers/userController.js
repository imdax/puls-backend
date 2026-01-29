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

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists:', email);
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user with ALL extra fields (strict: false in model handles this)
        const user = await User.create({
            fullName,
            email,
            phone,
            age,
            country,
            profession,
            ...otherFields
        });

        res.status(201).json({
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
    }
};

module.exports = {
    registerUser
};
