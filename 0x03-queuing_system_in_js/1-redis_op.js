import { createClient, print } from 'redis';

// Create Redis client
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

// Get value from Redis
function displaySchoolValue(schoolName) {
  client.get(schoolName, function(error, result) {
    if (error) throw error;
    console.log(result);
  });
}

// Test the functions
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
