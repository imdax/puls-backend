const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTest = async () => {
    try {
        console.log('🚀 Starting Company Flow Test...');

        // 1. Register AU Company
        console.log('\n--- 1. Registering AU Company ---');
        const uniqueSuffix = Date.now();
        const auCompanyData = {
            companyName: `AU Tech ${uniqueSuffix}`,
            email: `au${uniqueSuffix}@test.com`,
            password: 'password123',
            phone: '0400000000',
            industry: 'Technology',
            companySize: '11-50',
            location: { country: 'Australia', city: 'Sydney' }
        };

        let auToken;
        let auCompanyId;

        try {
            const res = await axios.post(`${API_URL}/company/register`, auCompanyData);
            console.log('✅ AU Company Registered:', res.data.email);
            auToken = res.data.token;
            auCompanyId = res.data._id;
        } catch (err) {
            console.error('❌ Registration Failed:', err.response ? err.response.data : err.message);
            return;
        }

        // 2. Register Non-AU Company
        console.log('\n--- 2. Registering Non-AU Company ---');
        const usCompanyData = {
            companyName: `US Tech ${uniqueSuffix}`,
            email: `us${uniqueSuffix}@test.com`,
            password: 'password123',
            phone: '1234567890',
            industry: 'Technology',
            companySize: '51-200',
            location: { country: 'USA', city: 'New York' }
        };

        let usToken;

        try {
            const res = await axios.post(`${API_URL}/company/register`, usCompanyData);
            console.log('✅ US Company Registered:', res.data.email);
            usToken = res.data.token;
        } catch (err) {
            console.error('❌ Registration Failed:', err.response ? err.response.data : err.message);
            return;
        }


        // 3. Post Job as AU Company (Should Succeed)
        console.log('\n--- 3. Posting Job as AU Company (Should Succeed) ---');
        const jobData = {
            title: 'Software Engineer',
            category: 'Engineering',
            jobType: 'Full-time',
            location: { country: 'Australia', city: 'Sydney' },
            experience: '3-5 Years',
            description: 'Great job',
            skills: ['Node.js', 'React']
        };

        try {
            const res = await axios.post(`${API_URL}/jobs`, jobData, {
                headers: { Authorization: `Bearer ${auToken}` }
            });
            console.log('✅ Job Posted Successfully:', res.data.data.title);
        } catch (err) {
            console.error('❌ Job Post Failed (Unexpected):', err.response ? err.response.data : err.message);
        }

        // 4. Post Job as US Company (Should Fail)
        console.log('\n--- 4. Posting Job as US Company (Should FAIL) ---');
        try {
            await axios.post(`${API_URL}/jobs`, jobData, {
                headers: { Authorization: `Bearer ${usToken}` }
            });
            console.error('❌ Error: Job Post Succeeded for US Company (Should have failed)');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('✅ Job Post Blocked as expected:', err.response.data.message);
            } else {
                console.error('❌ Unexpected Error:', err.response ? err.response.data : err.message);
            }
        }

        // 5. Verify Public Feed
        console.log('\n--- 5. Verifying Public Job Feed ---');
        let jobId;
        try {
            const res = await axios.get(`${API_URL}/jobs`);
            console.log(`✅ Jobs fetched: ${res.data.count}`);
            const postedJob = res.data.data.find(job => job.companyId.toString() === auCompanyId || (job.companyId._id && job.companyId._id.toString() === auCompanyId));

            if (postedJob) {
                console.log('✅ Posted job found in public feed');
                jobId = postedJob._id;
            } else {
                console.warn('⚠️ Posted job NOT found in public feed (might be pagination or status issue)');
            }

        } catch (err) {
            console.error('❌ Feed Fetch Failed:', err.response ? err.response.data : err.message);
        }

        if (jobId) {
            // 6. Update Job
            console.log('\n--- 6. Updating Job ---');
            try {
                const updateData = { title: 'Senior Software Engineer' };
                const res = await axios.put(`${API_URL}/jobs/${jobId}`, updateData, {
                    headers: { Authorization: `Bearer ${auToken}` }
                });
                if (res.data.data.title === 'Senior Software Engineer') {
                    console.log('✅ Job Updated Successfully');
                } else {
                    console.error('❌ Job Update Failed: Title mismatch');
                }
            } catch (err) {
                console.error('❌ Job Update Failed:', err.response ? err.response.data : err.message);
            }

            // 7. Toggle Status (Close Job)
            console.log('\n--- 7. Closing Job ---');
            try {
                const statusData = { status: 'closed' };
                const res = await axios.patch(`${API_URL}/jobs/${jobId}/status`, statusData, {
                    headers: { Authorization: `Bearer ${auToken}` }
                });
                if (res.data.data.status === 'closed') {
                    console.log('✅ Job Closed Successfully');
                } else {
                    console.error('❌ Job Close Failed: Status mismatch');
                }
            } catch (err) {
                console.error('❌ Job Status Update Failed:', err.response ? err.response.data : err.message);
            }

            // 8. Verify Job REMOVED from Public Feed
            console.log('\n--- 8. Verifying Closed Job is NOT in Public Feed ---');
            try {
                const res = await axios.get(`${API_URL}/jobs`);
                const closedJob = res.data.data.find(job => job._id === jobId);
                if (!closedJob) {
                    console.log('✅ Closed job is NOT in public feed');
                } else {
                    console.error('❌ Error: Closed job IS in public feed');
                }
            } catch (err) {
                console.error('❌ Feed Fetch Failed:', err.response ? err.response.data : err.message);
            }

            // 9. Delete Job
            console.log('\n--- 9. Deleting Job ---');
            try {
                await axios.delete(`${API_URL}/jobs/${jobId}`, {
                    headers: { Authorization: `Bearer ${auToken}` }
                });
                console.log('✅ Job Deleted Successfully');
            } catch (err) {
                console.error('❌ Job Delete Failed:', err.response ? err.response.data : err.message);
            }
        }

        console.log('\n🏁 Test Completed');

    } catch (error) {
        console.error('Global Error:', error);
    }
};

runTest();
