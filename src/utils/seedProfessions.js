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
        'Cinema or Theatre Manager', 'Financial Institution Branch Manager', 'Program or Project Administrator',
        'Contract Administrator'
    ],
    'ARTS, MEDIA & DESIGN': [
        'Dancer or Choreographer', 'Music Director', 'Musician (Instrumental)', 'Artistic Director',
        'Music Professionals', 'Photographer', 'Book or Script Editor', 'Director (Film, Television, Radio or Stage)',
        'Film and Video Editor', 'Program Director (Television or Radio)', 'Stage Manager', 'Technical Director',
        'Video Producer', 'Copywriter', 'Newspaper or Periodical Editor', 'Print Journalist', 'Technical Writer',
        'Television Journalist', 'Journalists and Other Writers', 'Fashion Designer', 'Industrial Designer',
        'Jewellery Designer', 'Graphic Designer', 'Illustrator', 'Web Designer', 'Interior Designer',
        'Camera Operator (Film, Television or Video)', 'Make-up Artist', 'Sound Technician', 'Performing Arts Technicians (nec)',
        'Signwriter', 'Potter or Ceramic Artist'
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
        'Barrister', 'Solicitor', 'Intellectual Property Lawyer', 'Judicial and Other Legal Professionals',
        'Insurance Loss Adjuster', 'Insurance Agent', 'Retail Buyer', 'Real Estate Representative', 'Conveyancer',
        'Legal Executive', 'Business Broker', 'Property Manager'
    ],
    'ICT & TECHNOLOGY': [
        'ICT Business Analyst', 'Systems Analyst', 'Multimedia Specialist', 'Analyst Programmer',
        'Developer Programmer', 'Software Engineer', 'Software Tester', 'Web Developer',
        'Database Administrator', 'Systems Administrator', 'Network Administrator', 'Network Analyst',
        'ICT Security Specialist', 'Computer Network and Systems Engineer', 'Telecommunications Engineer',
        'Telecommunications Network Engineer', 'ICT Quality Assurance Engineer', 'ICT Support Engineer',
        'ICT Systems Test Engineer', 'ICT Support and Test Engineers', 'ICT Trainer', 'Web Administrator',
        'ICT Customer Support Officer', 'ICT Support Technicians', 'Software and Applications Programmers (nec)',
        'Telecommunications Field Engineer', 'Telecommunications Network Planner', 'Telecommunications Technical Officer or Technologist',
        'Radio Communications Technician', 'Cabler (Data and Telecommunications)', 'Telecommunications Linesworker / Line Mechanic'
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
        'Dental Technician', 'Hospital Pharmacist', 'Industrial Pharmacist', 'Retail Pharmacist',
        'Occupational Health and Safety Adviser', 'Orthoptist', 'Health Diagnostic and Promotion Professionals (nec)',
        'Complementary Health Therapists (nec)', 'Pharmacy Technician', 'Medical Laboratory Technician',
        'Anaesthetic Technician', 'Cardiac Technician', 'Medical Technicians (nec)', 'Ambulance Officer',
        'Intensive Care Ambulance Paramedic', 'Massage Therapist', 'Diversional Therapist', 'Veterinary Nurse',
        'Clinical Psychologist', 'Educational Psychologist', 'Organisational Psychologist', 'Psychologists (nec)'
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
        'Physicist', 'Geologist', 'Other Spatial Scientist', 'Engineering Professionals (nec)',
        'Life Scientists (nec)', 'Natural and Physical Science Professionals (nec)', 'Conservator',
        'Civil Engineering Draftsperson', 'Civil Engineering Technician', 'Electrical Engineering Draftsperson',
        'Electrical Engineering Technician', 'Architectural Draftsperson', 'Building Inspector',
        'Architectural, Building and Surveying Technicians (nec)', 'Mechanical Engineering Technician',
        'Metallurgical or Materials Technician', 'Mine Deputy', 'Chemistry Technician', 'Earth Science Technician',
        'Life Science Technician', 'Science Technicians (nec)', 'Hardware Technician', 'Biothechnologist'
    ],
    'EDUCATION & SOCIAL': [
        'Early Childhood Teacher', 'Primary School Teacher', 'Secondary School Teacher', 'Special Needs Teacher',
        'Teacher of the Hearing Impaired', 'Teacher of the Sight Impaired', 'University Lecturer',
        'Education Adviser', 'Art Teacher (Private Tuition)', 'Dance Teacher (Private Tuition)',
        'Music Teacher (Private Tuition)', 'Teacher of English to Speakers of Other Languages',
        'Careers Counsellor', 'Drug and Alcohol Counsellor', 'Family and Marriage Counsellor',
        'Rehabilitation Counsellor', 'Student Counsellor', 'Psychotherapist', 'Interpreter', 'Translator',
        'Social Worker', 'Community Worker', 'Welfare Worker', 'Youth Worker', 'Recreation Officer',
        'Private Tutors and Teachers (nec)', 'Special Education Teachers (nec)', 'Counsellors (nec)',
        'Social Professionals (nec)', 'Disabilities Services Officer', 'Family Support Worker',
        'Residential Care Officer', 'Middle School Teacher'
    ],
    'TRADES & TECHNICAL': [
        'Automotive Electrician', 'Motor Mechanic', 'Diesel Motor Mechanic', 'Motorcycle Mechanic',
        'Sheetmetal Worker', 'Metal Fabricator', 'Pressure Welder', 'Welder', 'Fitter',
        'Fitter and Turner', 'Metal Machinist', 'Locksmith', 'Panelbeater', 'Bricklayer', 'Stonemason',
        'Carpenter and Joiner', 'Carpenter', 'Joiner', 'Painter', 'Glazier', 'Plasterer', 'Renderer',
        'Wall and Floor Tiler', 'Plumber', 'Gasfitter', 'Roof Plumber', 'Electrician', 'Lift Mechanic',
        'Airconditioning and Refrigeration Mechanic', 'Cabler', 'Electronic Equipment Trades Worker',
        'Electronic Instrument Trades Worker', 'Chef', 'Cook', 'Baker', 'Pastrycook', 'Butcher',
        'Cabinetmaker', 'Boat Builder and Repairer', 'Shipwright', 'Small Engine Mechanic',
        'Fitter Welder', 'Airconditioning and Mechanical Services Plumber', 'Drainer',
        'Technical Cable Jointer', 'Aircraft Maintenance Engineer (Avionics)', 'Aircraft Maintenance Engineer (Mechanical)',
        'Aircraft Maintenance Engineer (Structures)', 'Metal Fitters and Machinists (nec)',
        'Precision Instrument Maker and Repairer', 'Toolmaker', 'Vehicle Body Builder', 'Vehicle Trimmer',
        'Roof Tiler', 'Business Machine Mechanic', 'Print Finisher', 'Printing Machinist',
        'Upholsterer', 'Furniture Finisher', 'Wood Machinist', 'Wood Machinists and Other Wood Trades Workers (nec)',
        'Power Generation Plant Operator', 'Meat Inspector', 'Farrier'
    ],
    'AGRICULTURE, REGIONAL & OTHER': [
        'Aquaculture Farmer', 'Crop Farmer', 'Livestock Farmer', 'Beef Cattle Farmer',
        'Dairy Cattle Farmer', 'Sheep Farmer', 'Pig Farmer', 'Horse Breeder', 'Apiarist',
        'Poultry Farmer', 'Florist', 'Gardener', 'Arborist', 'Landscape Gardener', 'Greenkeeper',
        'Hairdresser', 'Dressmaker', 'Jeweller',
        'Sports Coach', 'Swimming Coach', 'Gymnastics Coach', 'Sports Development Officer',
        'Tennis Coach', 'Footballer', 'Flower Grower', 'Grape Grower', 'Vegetable Grower / Market Gardener',
        'Horse Trainer', 'Dog Handler or Trainer', 'Animal Attendants and Trainers (nec)',
        'Diving Instructor (Open Water)', 'Horse Riding Coach or Instructor', 'Snowsport Instructor',
        'Other Sports Coach or Instructor', 'Sportspersons (nec)'
    ]
};

// Raw list of additional/duplicate inputs to ensure coverage
const additionalProfessionsRaw = `
dietitian
nutritionist
occupational health and safety adviser
orthoptist
hospital pharmacist
industrial pharmacist
retail pharmacist
health promotion officer
health diagnostic and promotion professionals (nec)
acupuncturist
naturopath
traditional Chinese medicine practitioner
complementary health therapists (nec)
dental specialist
resident medical officer
nurse educator
nurse researcher
nurse manager
web developer
software tester
database administrator
systems administrator
network administrator
network analyst
ICT quality assurance engineer
ICT support engineer
ICT systems test engineer
ICT support and test engineers (nec)
judicial and other legal professionals (nec)
careers counsellor
drug and alcohol counsellor
family and marriage counsellor
rehabilitation counsellor
student counsellor
counsellors (nec)
psychotherapist
interpreter
social professionals (nec)
recreation officer / recreation coordinator
welfare worker
anaesthetic technician
cardiac technician
medical laboratory technician
pharmacy technician
medical technicians (nec)
meat inspector
primary products assurance and inspection officers (nec)
chemistry technician
earth science technician
life science technician
science technicians (nec)
architectural draftsperson
building inspector
architectural, building and surveying technicians (nec)
mechanical engineering technician
metallurgical or materials technician
mine deputy
hardware technician
ICT customer support officer
web administrator
ICT support technicians (nec)
farrier
aircraft maintenance engineer (avionics)
aircraft maintenance engineer (mechanical)
aircraft maintenance engineer (structures)
metal fitters and machinists (nec)
precision instrument maker and repairer
toolmaker
vehicle body builder
vehicle trimmer
roof tiler
business machine mechanic
cabler (data and telecommunications)
telecommunications linesworker / line mechanic
baker
pastrycook
butcher or smallgoods maker
cook
dog handler or trainer
animal attendants and trainers (nec)
veterinary nurse
florist
gardener (general)
arborist
landscape gardener
greenkeeper
hairdresser
print finisher
printing machinist
dressmaker or tailor
upholsterer
furniture finisher
wood machinist
wood machinists and other wood trades workers (nec)
power generation plant operator
jeweller
camera operator (film, television or video)
make-up artist
sound technician
performing arts technicians (nec)
signwriter
ambulance officer
intensive care ambulance paramedic
dental technician
diversional therapist
enrolled nurse
massage therapist
community worker
disabilities services officer
family support worker
residential care officer
youth worker
diving instructor (open water)
gymnastics coach or instructor
horse riding coach or instructor
snowsport instructor
swimming coach or instructor
other sports coach or instructor
sports development officer
sportspersons (nec)
contract administrator
program or project administrator
insurance loss adjuster
insurance agent
retail buyer
barrister
solicitor
clinical psychologist
educational psychologist
organisational psychologist
psychologists (nec)
social worker
civil engineering draftsperson
civil engineering technician
electrical engineering draftsperson
electrical engineering technician
radio communications technician
telecommunications field engineer
telecommunications network planner
telecommunications technical officer or technologist
automotive electrician
motor mechanic (general)
diesel motor mechanic
motorcycle mechanic
small engine mechanic
sheetmetal worker
metal fabricator
pressure welder
welder (first class)
fitter (general)
fitter and turner
fitter welder
metal machinist (first class)
locksmith
panelbeater
bricklayer
stonemason
carpenter and joiner
carpenter
joiner
painter
glazier
plasterer (wall and ceiling)
renderer (solid plaster)
wall and floor tiler
plumber (general)
airconditioning and mechanical services plumber
drainer
gasfitter
roof plumber
electrician (general)
electrician (special class)
lift mechanic
airconditioning and refrigeration mechanic
technical cable jointer
electronic equipment trades worker
electronic instrument trades worker (general)
electronic instrument trades worker (special class)
chef
horse trainer
cabinetmaker
boat builder and repairer
shipwright
tennis coach
footballer
flower grower
grape grower
vegetable grower / market gardener
apiarist
poultry farmer
sales and marketing manager
advertising manager
corporate services manager
finance manager
human resource manager
research and development manager
manufacturer
production manager (forestry)
production manager (manufacturing)
production manager (mining)
supply and distribution manager
health and welfare services managers (nec)
school principal
education managers (nec)
ICT project manager
ICT managers (nec)
laboratory manager
quality assurance manager
specialist managers (nec)
cafe or restaurant manager
hotel or motel manager
accommodation and hospitality managers (nec)
customer service manager
conference and event organiser
transport company manager
facilities manager
music professionals (nec)
photographer
book or script editor
director (film, television, radio or stage)
film and video editor
program director (television or radio)
stage manager
technical director
video producer
copywriter
newspaper or periodical editor
print journalist
technical writer
television journalist
journalists and other writers (nec)
company secretary
commodities trader
finance broker
insurance broker
financial brokers (nec)
financial market dealer
stockbroking dealer
financial dealers (nec)
financial investment adviser
financial investment manager
recruitment consultant
ICT trainer
mathematician
gallery or museum curator
health information manager
records manager
librarian
organisation and methods analyst
patents examiner
information and organisation professionals (nec)
advertising specialist
marketing specialist
ICT account manager
ICT business development manager
ICT sales representative
public relations professional
technical sales representatives (nec)
fashion designer
industrial designer
jewellery designer
graphic designer
illustrator
web designer
interior designer
urban and regional planner
geologist
primary school teacher
middle school teacher
education adviser
art teacher (private tuition)
dance teacher (private tuition)
music teacher (private tuition)
private tutors and teachers (nec)
teacher of English to speakers of other languages
construction project manager
engineering manager
child care centre manager
nursing clinical director
primary health organisation manager
welfare centre manager
arts administrator or manager
environmental manager
dancer or choreographer
music director
musician (instrumental)
artistic director
accountant (general)
management accountant
taxation accountant
external auditor
internal auditor
actuary
statistician
economist
land economist
valuer
management consultant
architect
landscape architect
surveyor
cartographer
other spatial scientist
chemical engineer
materials engineer
civil engineer
geotechnical engineer
quantity surveyor
structural engineer
transport engineer
electrical engineer
electronics engineer
industrial engineer
mechanical engineer
production or plant engineer
mining engineer (excluding petroleum)
petroleum engineer
aeronautical engineer
agricultural engineer
biomedical engineer
engineering technologist
environmental engineer
naval architect / marine designer
engineering professionals (nec)
agricultural consultant
agricultural scientist
forester / forest scientist
chemist
food technologist
environmental consultant
environmental research scientist
environmental scientist (nec)
geophysicist
hydrogeologist
life scientist (general)
biochemist
biotechnologist
botanist
marine biologist
microbiologist
zoologist
life scientists (nec)
medical laboratory scientist
veterinarian
conservator
metallurgist
meteorologist
physicist
natural and physical science professionals (nec)
early childhood (pre primary school) teacher
secondary school teacher
special needs teacher
teacher of the hearing impaired
teacher of the sight impaired
special education teachers (nec)
university lecturer
medical diagnostic radiographer
medical radiation therapist
nuclear medicine technologist
sonographer
optometrist
orthotist or prosthetist
chiropractor
osteopath
occupational therapist
physiotherapist
podiatrist
audiologist
speech pathologist / speech language therapist
general practitioner
specialist physician (general medicine)
cardiologist
clinical haematologist
medical oncologist
endocrinologist
gastroenterologist
intensive care specialist
neurologist
paediatrician
renal medicine specialist
rheumatologist
thoracic medicine specialist
specialist physicians (nec)
psychiatrist
surgeon (general)
cardiothoracic surgeon
neurosurgeon
orthopaedic surgeon
otorhinolaryngologist
paediatric surgeon
plastic and reconstructive surgeon
urologist
vascular surgeon
dermatologist
emergency medicine specialist
obstetrician and gynaecologist
ophthalmologist
pathologist
diagnostic and interventional radiologist
radiation oncologist
medical practitioners (nec)
midwife
nurse practitioner
registered nurse (aged care)
registered nurse (child and family health)
registered nurse (community health)
registered nurse (critical care and emergency)
registered nurse (developmental disability)
registered nurse (disability and rehabilitation)
registered nurse (medical)
registered nurse (medical practice)
registered nurse (mental health)
registered nurse (perioperative)
registered nurse (surgical)
registered nurse (paediatrics)
registered nurses (nec)
ICT business analyst
systems analyst
multimedia specialist
analyst programmer
developer programmer
software engineer
software and applications programmers (nec)
ICT security specialist
computer network and systems engineer
telecommunications engineer
telecommunications network engineer
`;

// Helper to determine category for leftovers
const determineCategory = (name) => {
    const n = name.toLowerCase();
    if (n.includes('manager') || n.includes('director') || n.includes('executive')) return 'MANAGEMENT & EXECUTIVE';
    if (n.includes('artist') || n.includes('designer') || n.includes('music') || n.includes('writer')) return 'ARTS, MEDIA & DESIGN';
    if (n.includes('accountant') || n.includes('broker') || n.includes('financial') || n.includes('lawyer')) return 'BUSINESS, FINANCE & LAW';
    if (n.includes('engineer') || n.includes('scientist')) return 'SCIENCE & ENGINEERING';
    if (n.includes('teacher') || n.includes('lecturer') || n.includes('counsellor')) return 'EDUCATION & SOCIAL';
    if (n.includes('nurse') || n.includes('medical') || n.includes('therapist') || n.includes('physician')) return 'HEALTH & MEDICAL';
    if (n.includes('technician') || n.includes('mechanic') || n.includes('fitter') || n.includes('electrician')) return 'TRADES & TECHNICAL';
    if (n.includes('farmer') || n.includes('gardener')) return 'AGRICULTURE, REGIONAL & OTHER';
    if (n.includes('ict') || n.includes('software') || n.includes('network') || n.includes('web')) return 'ICT & TECHNOLOGY';
    return 'AGRICULTURE, REGIONAL & OTHER'; // Default/Fallback
};

const seedProfessions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing professions to allow re-seeding with new data
        await Profession.deleteMany({});
        console.log('Cleared existing professions');

        const professionsList = [];
        const addedSlugs = new Set(); // To track duplicates via slug

        // Helper to add profession if unique
        const addProfession = (name, category) => {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            if (!addedSlugs.has(slug)) {
                professionsList.push({ name: name.trim(), category, slug });
                addedSlugs.add(slug);
            }
        };

        // 1. Add explicitly categorized professions
        for (const [category, names] of Object.entries(professionCategories)) {
            names.forEach(name => {
                addProfession(name, category);
            });
        }

        // 2. Add from raw list (deduplicating against above)
        const rawLines = additionalProfessionsRaw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        for (const item of rawLines) {
            // Determine category or default
            const category = determineCategory(item);
            addProfession(item, category);
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
