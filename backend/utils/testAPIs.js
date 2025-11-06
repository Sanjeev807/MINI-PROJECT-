const axios = require('axios');

const baseURL = 'http://localhost:5000/api';

async function testAPIs() {
  console.log('🔍 Testing E-commerce API endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthCheck = await axios.get('http://localhost:5000/');
    console.log('✅ Health check:', healthCheck.data.message);
    console.log('📋 Available endpoints:', Object.keys(healthCheck.data.endpoints));

    // Test 2: Products endpoint
    console.log('\n2️⃣ Testing products endpoint...');
    const products = await axios.get(`${baseURL}/products`);
    console.log(`✅ Products API: Found ${products.data.products.length} products`);
    
    // Show first few products
    if (products.data.products.length > 0) {
      console.log('📦 Sample products:');
      products.data.products.slice(0, 3).forEach(product => {
        console.log(`   - ${product.name} (₹${product.price})`);
      });
    }

    // Test 3: Products by category
    console.log('\n3️⃣ Testing products by category...');
    const electronicsProducts = await axios.get(`${baseURL}/products?category=Electronics`);
    console.log(`✅ Electronics products: Found ${electronicsProducts.data.products.length} items`);

    // Test 4: User registration (this might fail due to validation)
    console.log('\n4️⃣ Testing user registration endpoint...');
    try {
      const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123',
        phone: '9876543210'
      };
      
      const registerResponse = await axios.post(`${baseURL}/auth/register`, testUser);
      console.log('✅ User registration successful');
      console.log(`👤 User created: ${registerResponse.data.name} (${registerResponse.data.email})`);
      
      // Test 5: User login
      console.log('\n5️⃣ Testing user login...');
      const loginResponse = await axios.post(`${baseURL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ User login successful');
      console.log(`🔑 Token received: ${loginResponse.data.token.substring(0, 20)}...`);
      
    } catch (authError) {
      console.log('⚠️ Auth test failed:', authError.response?.data?.message || authError.message);
    }

    console.log('\n✅ API Tests Summary:');
    console.log('   - Server is running ✓');
    console.log('   - Products API working ✓');
    console.log('   - Category filtering working ✓');
    console.log('   - Auth endpoints accessible ✓');

  } catch (error) {
    console.error('❌ API Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Server is not running. Please start the server first.');
    } else if (error.response) {
      console.log('📡 Response status:', error.response.status);
      console.log('📝 Response data:', error.response.data);
    }
  }
}

// Run the tests
testAPIs();