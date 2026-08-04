require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const axios = require('axios');

async function main() {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
  const email = process.env.OPERATOR_EMAIL || 'operator@passo.com';
  const password = process.env.OPERATOR_PASSWORD || 'Operator123!';

  try {
    const loginRes = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
    const token = loginRes.data.token;

    const departureTime = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    const estimatedArrival = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();

    const tripRes = await axios.post(
      `${baseUrl}/api/trips`,
      {
        routeId: 1,
        vehicleId: 1,
        departureTime,
        estimatedArrival,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log('Trip created successfully');
    console.log(JSON.stringify(tripRes.data, null, 2));
  } catch (error) {
    console.error('Failed to create sample trip');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

main();
