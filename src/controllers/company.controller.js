const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Company = require('../models/Company');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id, role: 'company' }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });
};

// @desc    Register new company
// @route   POST /api/company/register
// @access  Public
const registerCompany = async (req, res) => {
    const { companyName, email, password, phone, website, industry, companySize, location } = req.body;

    try {
        if (!companyName || !email || !password || !phone || !industry || !companySize || !location) {
            return res.status(400).json({ message: 'Please include all fields' });
        }

        // Check availability
        const companyExists = await Company.findOne({ email });

        if (companyExists) {
            return res.status(400).json({ message: 'Company already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create company
        const company = await Company.create({
            companyName,
            email,
            password: hashedPassword,
            phone,
            website,
            industry,
            companySize,
            location
        });

        if (company) {
            res.status(201).json({
                _id: company.id,
                companyName: company.companyName,
                email: company.email,
                token: generateToken(company._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid company data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate a company
// @route   POST /api/company/login
// @access  Public
const loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {
        const company = await Company.findOne({ email }).select('+password');

        if (company && (await bcrypt.compare(password, company.password))) {
            res.json({
                _id: company.id,
                companyName: company.companyName,
                email: company.email,
                token: generateToken(company._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get company data
// @route   GET /api/company/me
// @access  Private (Company)
const getMe = async (req, res) => {
    res.status(200).json(req.company);
};

// @desc    Update company profile
// @route   PUT /api/company/update-profile
// @access  Private (Company)
const updateCompanyProfile = async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.company.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerCompany,
    loginCompany,
    getMe,
    updateCompanyProfile
};
