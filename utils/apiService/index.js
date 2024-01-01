const axios = require('axios');
const BASE_URL = "http://localhost:4000"
const makeRequest = async (endpoint, method) => {
  try {
    let response;
    const dummyData = { key: 'value' }; // Replace with actual data structure as needed
    const URL = `${BASE_URL}${endpoint}`
    switch (method) {
      case 'GET':
        response = await axios.get(URL);
        break;
      case 'POST':
        response = await axios.post(URL, dummyData);
        break;
      case 'PUT':
        response = await axios.put(URL, dummyData);
        break;
      case 'PATCH':
        response = await axios.patch(URL, dummyData);
        break;
      case 'DELETE':
        response = await axios.delete(URL);
        break;
      default:
        throw new Error('Invalid method');
    }
    return response.data;
  } catch (error) {
    console.error('Error making request:', error);
  }
};

module.exports = {makeRequest}

