const http = require('http');

// Helper to make HTTP requests
const request = (path, method, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
};

const runTests = async () => {
    console.log('--- Starting Verification Tests ---\n');

    try {
        // 1. Get Professions
        console.log('1. Testing GET /api/professions...');
        const profRes = await request('/api/professions', 'GET');
        console.log(`Status: ${profRes.status}`);
        console.log(`Count: ${profRes.data.count}`);
        if (profRes.status === 200 && profRes.data.count > 0) console.log('✅ PASS\n');
        else console.log('❌ FAIL\n');

        // 2. Register Valid User
        console.log('2. Testing POST /api/register (Valid User)...');
        const validUser = {
            fullName: "Alice Test",
            email: `alice_${Date.now()}@test.com`, // Unique email
            phone: "0400111222",
            age: 30,
            country: "Australia",
            profession: "Software Engineer"
        };
        const regRes = await request('/api/register', 'POST', validUser);
        console.log(`Status: ${regRes.status}`);
        if (regRes.status === 201 && regRes.data.success) {
            console.log('✅ PASS');
            console.log(`User ID: ${regRes.data.data._id}\n`);

            // 3. Assess Valid User
            console.log('3. Testing POST /api/assessment/start (Should ACCEPT)...');
            const assessRes = await request('/api/assessment/start', 'POST', { userId: regRes.data.data._id });
            console.log(`Status: ${assessRes.status}`);
            console.log(`Result: ${assessRes.data.data?.status}`);
            if (assessRes.status === 201 && assessRes.data.data.status === 'ACCEPTED') console.log('✅ PASS\n');
            else console.log('❌ FAIL\n');

        } else {
            console.log('❌ FAIL Registration\n');
        }

        // 4. Register Invalid User (Age > 50)
        console.log('4. Testing Registration & Assessment (Invalid Age)...');
        const oldUser = {
            fullName: "Bob Old",
            email: `bob_${Date.now()}@test.com`,
            phone: "0400999888",
            age: 60,
            country: "UK",
            profession: "Chef"
        };

        const regOld = await request('/api/register', 'POST', oldUser);
        if (regOld.status === 201) {
            const assessOld = await request('/api/assessment/start', 'POST', { userId: regOld.data.data._id });
            console.log(`Assessment Status: ${assessOld.data.data?.status}`);
            console.log(`Reasons: ${assessOld.data.data?.reasons.join(', ')}`);
            if (assessOld.data.data?.status === 'REJECTED' && assessOld.data.data?.reasons[0].includes('Age')) {
                console.log('✅ PASS (Correctly Rejected)\n');
            } else {
                console.log('❌ FAIL (Should have rejected)\n');
            }
        } else {
            console.log('❌ FAIL Registration for Age Test\n');
        }

    } catch (error) {
        console.error('Test Script Error:', error);
    }
};

runTests();
