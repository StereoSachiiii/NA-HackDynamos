import http from 'http';

const BASE_URL = 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api/v1`;

// Helper to make HTTP requests
const makeRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
};

// Test functions
const tests = {
  health: async () => {
    console.log('\n🔍 Testing Health Endpoint...');
    const result = await makeRequest(`${BASE_URL}/health`);
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result.status === 200;
  },

  apiBase: async () => {
    console.log('\n🔍 Testing API Base Endpoint...');
    const result = await makeRequest(`${API_BASE}`);
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result.status === 200;
  },

  register: async () => {
    console.log('\n🔍 Testing User Registration...');
    const result = await makeRequest(`${API_BASE}/users/register`, {
      method: 'POST',
      body: {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Test123!@#'
      }
    });
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return { success: result.status === 201, data: result.data };
  },

  login: async (email, password) => {
    console.log('\n🔍 Testing User Login...');
    const result = await makeRequest(`${API_BASE}/users/login`, {
      method: 'POST',
      body: { email, password }
    });
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return { success: result.status === 200, data: result.data };
  },

  getProfile: async (token) => {
    console.log('\n🔍 Testing Get Profile (Protected)...');
    const result = await makeRequest(`${API_BASE}/users/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result.status === 200;
  },

  getDailySummary: async (token) => {
    console.log('\n🔍 Testing Daily Summary (Protected)...');
    const result = await makeRequest(`${API_BASE}/logs/daily-summary`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result.status === 200;
  },

  getInsights: async (token) => {
    console.log('\n🔍 Testing Insights (Protected)...');
    const result = await makeRequest(`${API_BASE}/logs/insights`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result.status === 200;
  },

  getReminders: async (token) => {
    console.log('\n🔍 Testing Reminders (Protected)...');
    const result = await makeRequest(`${API_BASE}/logs/reminders`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result.status === 200;
  },

  getGoals: async (token) => {
    console.log('\n🔍 Testing Goals (Protected)...');
    const result = await makeRequest(`${API_BASE}/goals`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result.status === 200;
  },

  getTips: async (token) => {
    console.log('\n🔍 Testing Tips (Protected)...');
    const result = await makeRequest(`${API_BASE}/tips`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result.status === 200;
  }
};

// Run tests
const runTests = async () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🧪 Testing Nutrition Advisor API Endpoints');
  console.log('═══════════════════════════════════════════════════════════');

  try {
    // Test public endpoints
    await tests.health();
    await tests.apiBase();

    // Test registration
    const registerResult = await tests.register();
    if (!registerResult.success) {
      console.log('\n❌ Registration failed, trying login with existing user...');
      // Try login with a test account
      const loginResult = await tests.login('test@example.com', 'Test123!@#');
      if (!loginResult.success) {
        console.log('\n❌ Could not authenticate. Please register a user first.');
        return;
      }
      const token = loginResult.data?.tokens?.accessToken;
      if (token) {
        await tests.getProfile(token);
        await tests.getDailySummary(token);
        await tests.getInsights(token);
        await tests.getReminders(token);
        await tests.getGoals(token);
        await tests.getTips(token);
      }
    } else {
      // Registration successful, now login
      const email = registerResult.data?.user?.email;
      if (email) {
        const loginResult = await tests.login(email, 'Test123!@#');
        const token = loginResult.data?.tokens?.accessToken;
        if (token) {
          await tests.getProfile(token);
          await tests.getDailySummary(token);
          await tests.getInsights(token);
          await tests.getReminders(token);
          await tests.getGoals(token);
          await tests.getTips(token);
        }
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ API Testing Complete');
    console.log('═══════════════════════════════════════════════════════════');
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    console.error(error.stack);
  }
};

runTests();

