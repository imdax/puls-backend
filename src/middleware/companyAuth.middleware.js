const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

const protectCompany = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123'); // Fallback for safety

            // Get company from the token
            req.company = await Company.findById(decoded.id).select('-password');

            if (!req.company) {
                return res.status(401).json({ message: 'Not authorized, company not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protectCompany };
