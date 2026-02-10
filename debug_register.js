const axios = require('axios');

async function testRegister() {
    try {
        const payload = {
            companyName: "Test Co " + Date.now(),
            email: `test${Date.now()}@test.com`,
            password: "password123",
            phone: "1234567890",
            website: "https://test.com",
            industry: "Tech",
            companySize: "1-10",
            location: {
                country: "USA",
                city: "New York"
            }
        };

        console.log('Sending payload:', payload);

        const response = await axios.post('http://localhost:5000/company/register', payload);
        console.log('Success:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testRegister();
