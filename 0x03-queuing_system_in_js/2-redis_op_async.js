import { createClient, print } from 'redis';
import { promisify } from 'util';

const client = createClient();

// Handle successful connection
client.on('connect', function() {
  console.log('Redis client connected to the server');
});

// Handle connection error
client.on('error', function (err) {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Set value in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

// Promisify get to use async/await
const get = promisify(client.get).bind(client);

// Get value from Redis
async function displaySchoolValue(schoolName) {
  const result = await get(schoolName).catch((error) => {
    if (error) throw error;
  });
  console.log(result);
}

// Test the functions
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
