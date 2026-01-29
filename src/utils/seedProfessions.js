const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profession = require('../models/Profession');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const professionCategories = {
    'MANAGEMENT & EXECUTIVE': [
        'Construction Project Manager', 'Engineering Manager', 'Child Care Centre Manager',
        'Nursing Clinical Director', 'Primary Health Organisation Manager', 'Welfare Centre Manager',
        'Arts Administrator or Manager', 'Environmental Manager', 'Sales and Marketing Manager',
        'Advertising Manager', 'Corporate Services Manager', 'Finance Manager', 'Human Resource Manager',
        'Research and Development Manager', 'Manufacturer', 'Production Manager (Forestry)',
        'Production Manager (Manufacturing)', 'Production Manager (Mining)', 'Supply and Distribution Manager',
        'Health and Welfare Services Managers', 'School Principal', 'Education Managers',
        'ICT Project Manager', 'ICT Managers', 'Laboratory Manager', 'Quality Assurance Manager',
        'Specialist Managers', 'Cafe or Restaurant Manager', 'Hotel or Motel Manager',
        'Accommodation and Hospitality Managers', 'Customer Service Manager', 'Conference and Event Organiser',
        'Transport Company Manager', 'Facilities Manager', 'Public Relations Manager',
        'Policy and Planning Manager', 'Project Builder', 'Procurement Manager', 'Medical Administrator',
        'Regional Education Manager', 'Sports Administrator', 'Caravan Park and Camping Ground Manager',
        'Post Office Manager', 'Amusement Centre Manager', 'Fitness Centre Manager', 'Sports Centre Manager',
        'Cinema or Theatre Manager', 'Financial Institution Branch Manager'
    ],
    'ARTS, MEDIA & DESIGN': [
        'Dancer or Choreographer', 'Music Director', 'Musician (Instrumental)', 'Artistic Director',
        'Music Professionals', 'Photographer', 'Book or Script Editor', 'Director (Film, Television, Radio or Stage)',
        'Film and Video Editor', 'Program Director (Television or Radio)', 'Stage Manager', 'Technical Director',
        'Video Producer', 'Copywriter', 'Newspaper or Periodical Editor', 'Print Journalist', 'Technical Writer',
        'Television Journalist', 'Journalists and Other Writers', 'Fashion Designer', 'Industrial Designer',
        'Jewellery Designer', 'Graphic Designer', 'Illustrator', 'Web Designer', 'Interior Designer'
    ],
    'BUSINESS, FINANCE & LAW': [
        'Accountant (General)', 'Management Accountant', 'Taxation Accountant', 'External Auditor',
        'Internal Auditor', 'Actuary', 'Statistician', 'Economist', 'Land Economist', 'Valuer',
        'Management Consultant', 'Company Secretary', 'Commodities Trader', 'Finance Broker',
        'Insurance Broker', 'Financial Market Dealer', 'Stockbroking Dealer', 'Financial Investment Adviser',
        'Financial Investment Manager', 'Recruitment Consultant', 'Mathematician', 'Gallery or Museum Curator',
        'Health Information Manager', 'Records Manager', 'Librarian', 'Organisation and Methods Analyst',
        'Patents Examiner', 'Advertising Specialist', 'Marketing Specialist', 'ICT Account Manager',
        'ICT Business Development Manager', 'ICT Sales Representative', 'Public Relations Professional',
        'Barrister', 'Solicitor', 'Intellectual Property Lawyer', 'Judicial and Other Legal Professionals'
    ],
    'ICT & TECHNOLOGY': [
        'ICT Business Analyst', 'Systems Analyst', 'Multimedia Specialist', 'Analyst Programmer',
        'Developer Programmer', 'Software Engineer', 'Software Tester', 'Web Developer',
        'Database Administrator', 'Systems Administrator', 'Network Administrator', 'Network Analyst',
        'ICT Security Specialist', 'Computer Network and Systems Engineer', 'Telecommunications Engineer',
        'Telecommunications Network Engineer', 'ICT Quality Assurance Engineer', 'ICT Support Engineer',
        'ICT Systems Test Engineer', 'ICT Support and Test Engineers', 'ICT Trainer', 'Web Administrator',
        'ICT Customer Support Officer', 'ICT Support Technicians'
    ],
    'HEALTH & MEDICAL': [
        'Chiropractor', 'Osteopath', 'Occupational Therapist', 'Physiotherapist', 'Podiatrist',
        'Audiologist', 'Speech Pathologist', 'General Practitioner', 'Specialist Physician',
        'Cardiologist', 'Clinical Haematologist', 'Medical Oncologist', 'Endocrinologist',
        'Gastroenterologist', 'Intensive Care Specialist', 'Neurologist', 'Paediatrician',
        'Renal Medicine Specialist', 'Rheumatologist', 'Thoracic Medicine Specialist', 'Psychiatrist',
        'Surgeon (General)', 'Cardiothoracic Surgeon', 'Neurosurgeon', 'Orthopaedic Surgeon',
        'Otorhinolaryngologist', 'Paediatric Surgeon', 'Plastic and Reconstructive Surgeon', 'Urologist',
        'Vascular Surgeon', 'Dermatologist', 'Emergency Medicine Specialist', 'Obstetrician and Gynaecologist',
        'Ophthalmologist', 'Pathologist', 'Diagnostic and Interventional Radiologist', 'Radiation Oncologist',
        'Medical Practitioners', 'Midwife', 'Nurse Practitioner', 'Registered Nurse (all specialisations)',
        'Enrolled Nurse', 'Medical Diagnostic Radiographer', 'Medical Radiation Therapist',
        'Nuclear Medicine Technologist', 'Sonographer', 'Optometrist', 'Orthotist or Prosthetist',
        'Dietitian', 'Nutritionist', 'Health Promotion Officer', 'Acupuncturist', 'Naturopath',
        'Traditional Chinese Medicine Practitioner', 'Dental Specialist', 'Resident Medical Officer',
        'Nurse Educator', 'Nurse Researcher', 'Nurse Manager', 'Dental Hygienist', 'Dental Therapist',
        'Dental Technician', 'Hospital Pharmacist', 'Industrial Pharmacist', 'Retail Pharmacist'
    ],
    'SCIENCE & ENGINEERING': [
        'Architect', 'Landscape Architect', 'Surveyor', 'Cartographer', 'Chemical Engineer',
        'Materials Engineer', 'Civil Engineer', 'Geotechnical Engineer', 'Quantity Surveyor',
        'Structural Engineer', 'Transport Engineer', 'Electrical Engineer', 'Electronics Engineer',
        'Industrial Engineer', 'Mechanical Engineer', 'Production or Plant Engineer', 'Mining Engineer',
        'Petroleum Engineer', 'Aeronautical Engineer', 'Agricultural Engineer', 'Biomedical Engineer',
        'Engineering Technologist', 'Environmental Engineer', 'Naval Architect', 'Agricultural Consultant',
        'Agricultural Scientist', 'Forester', 'Chemist', 'Food Technologist', 'Environmental Consultant',
        'Environmental Research Scientist', 'Environmental Scientist', 'Geophysicist', 'Hydrogeologist',
        'Life Scientist', 'Biochemist', 'Biotechnologist', 'Botanist', 'Marine Biologist', 'Microbiologist',
        'Zoologist', 'Medical Laboratory Scientist', 'Veterinarian', 'Metallurgist', 'Meteorologist',
        'Physicist', 'Geologist'
    ],
    'EDUCATION & SOCIAL': [
        'Early Childhood Teacher', 'Primary School Teacher', 'Secondary School Teacher', 'Special Needs Teacher',
        'Teacher of the Hearing Impaired', 'Teacher of the Sight Impaired', 'University Lecturer',
        'Education Adviser', 'Art Teacher (Private Tuition)', 'Dance Teacher (Private Tuition)',
        'Music Teacher (Private Tuition)', 'Teacher of English to Speakers of Other Languages',
        'Careers Counsellor', 'Drug and Alcohol Counsellor', 'Family and Marriage Counsellor',
        'Rehabilitation Counsellor', 'Student Counsellor', 'Psychotherapist', 'Interpreter', 'Translator',
        'Social Worker', 'Community Worker', 'Welfare Worker', 'Youth Worker', 'Recreation Officer'
    ],
    'TRADES & TECHNICAL': [
        'Automotive Electrician', 'Motor Mechanic', 'Diesel Motor Mechanic', 'Motorcycle Mechanic',
        'Sheetmetal Worker', 'Metal Fabricator', 'Pressure Welder', 'Welder', 'Fitter',
        'Fitter and Turner', 'Metal Machinist', 'Locksmith', 'Panelbeater', 'Bricklayer', 'Stonemason',
        'Carpenter and Joiner', 'Carpenter', 'Joiner', 'Painter', 'Glazier', 'Plasterer', 'Renderer',
        'Wall and Floor Tiler', 'Plumber', 'Gasfitter', 'Roof Plumber', 'Electrician', 'Lift Mechanic',
        'Airconditioning and Refrigeration Mechanic', 'Cabler', 'Electronic Equipment Trades Worker',
        'Electronic Instrument Trades Worker', 'Chef', 'Cook', 'Baker', 'Pastrycook', 'Butcher',
        'Cabinetmaker', 'Boat Builder and Repairer', 'Shipwright'
    ],
    'AGRICULTURE, REGIONAL & OTHER': [
        'Aquaculture Farmer', 'Crop Farmer', 'Livestock Farmer', 'Beef Cattle Farmer',
        'Dairy Cattle Farmer', 'Sheep Farmer', 'Pig Farmer', 'Horse Breeder', 'Apiarist',
        'Poultry Farmer', 'Florist', 'Gardener', 'Arborist', 'Landscape Gardener', 'Greenkeeper',
        'Hairdresser', 'Dressmaker', 'Upholsterer', 'Furniture Finisher', 'Jeweller', 'Make-up Artist',
        'Sound Technician', 'Signwriter', 'Ambulance Officer', 'Paramedic', 'Massage Therapist',
        'Sports Coach', 'Swimming Coach', 'Gymnastics Coach', 'Sports Development Officer',
        'Contract Administrator', 'Program or Project Administrator', 'Insurance Loss Adjuster',
        'Insurance Agent', 'Retail Buyer', 'Property Manager', 'Real Estate Representative'
    ]
};

const seedProfessions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing professions to allow re-seeding with new data
        await Profession.deleteMany({});
        console.log('Cleared existing professions');

        const professionsList = [];
        for (const [category, names] of Object.entries(professionCategories)) {
            names.forEach(name => {
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                professionsList.push({ name, category, slug });
            });
        }

        await Profession.insertMany(professionsList);
        console.log(`Successfully seeded ${professionsList.length} professions across ${Object.keys(professionCategories).length} categories.`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (require.main === module) {
    seedProfessions();
}

module.exports = seedProfessions;
