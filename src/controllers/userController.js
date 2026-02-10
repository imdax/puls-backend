const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        let { fullName, firstName, lastName, email, phone, age, country, profession, ...otherFields } = req.body;
        console.log('Received Registration Request:', JSON.stringify(req.body, null, 2));

        // Handle firstName + lastName -> fullName
        if (!fullName && firstName && lastName) {
            fullName = `${firstName} ${lastName.trim()}`;
        }

        // Handle case mismatch or alias
        if (!fullName) {
            fullName = req.body.fullname || req.body.name;
        }

        // --- ROBUST PROFESSION HANDLING ---
        // Identify if profession is an object (common with some dropdown libraries)
        if (profession && typeof profession === 'object') {
            console.log('Profession received as object:', profession);
            profession = profession.name || profession.label || profession.value || profession.id || null;
        } else if (!profession) {
            // Fallback: check for professionName or professionId in top-level body
            profession = req.body.professionName || req.body.professionId;
        }

        // Ensure profession is a simple string now
        if (typeof profession !== 'string') {
            // If we failed to extract a string, set to null so validation catches it cleanly
            // or keep it as is if it's undefined, to let validation handle "missing"
            if (profession) {
                console.warn('Profession field present but not a string after parsing:', profession);
                // Optional: force string if it's a number? 
                profession = String(profession);
            }
        }
        console.log('Parsed Profession:', profession);
        // ----------------------------------

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
