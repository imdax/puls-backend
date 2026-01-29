const Profession = require('../models/Profession');

// Assessment Rules
const rules = [
    {
        id: 'AGE_LIMIT',
        description: 'Age must not be greater than 50 years',
        evaluate: async (user) => {
            if (user.age > 50) {
                return { passed: false, reason: 'Age exceeds limit (Maximum 50 years)' };
            }
            return { passed: true };
        }
    },
    {
        id: 'PROFESSION_ELIGIBILITY',
        description: 'Profession must be in the accepted list',
        evaluate: async (user) => {
            // Check if user's profession exists in the DB (case-insensitive check handled by DB or seeding)
            // Ideally, we compare slugs or exact names. 
            // Since user.profession is free text but we want to validate it, 
            // we'll check if a Profession document exists with that name (case-insensitive regex).

            const professionExists = await Profession.findOne({
                name: { $regex: new RegExp(`^${user.profession}$`, 'i') }
            });

            if (!professionExists) {
                return { passed: false, reason: 'Profession not eligible for assessment' };
            }
            return { passed: true };
        }
    }
];

// Main Evaluation Function
const evaluateUser = async (user) => {
    const reasons = [];
    let status = 'ACCEPTED';

    for (const rule of rules) {
        try {
            const result = await rule.evaluate(user);
            if (!result.passed) {
                status = 'REJECTED';
                reasons.push(result.reason);
            }
        } catch (error) {
            console.error(`Error evaluating rule ${rule.id}:`, error);
            // If a rule errors out, we might want to fail safe or reject. 
            // For now, let's treat it as a system rejection.
            status = 'REJECTED';
            reasons.push(`System error evaluating rule: ${rule.description}`);
        }
    }

    return { status, reasons };
};

module.exports = {
    evaluateUser
};
