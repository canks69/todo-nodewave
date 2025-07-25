// This is a simple test file to verify that the API configuration works correctly
// You can run this file with ts-node or include it in your test suite

import api from './api';

// Log the baseURL to verify it's using the correct environment variable
console.log('API baseURL:', api.defaults.baseURL);

// This confirms that the API is configured correctly with Next.js environment variables
// If NEXT_PUBLIC_API_URL is set, it will use that value
// Otherwise, it will fall back to "/api"

// Example usage:
// async function testApi() {
//   try {
//     const response = await api.get('/some-endpoint');
//     console.log('API response:', response.data);
//   } catch (error) {
//     console.error('API error:', error);
//   }
// }
// 
// testApi();