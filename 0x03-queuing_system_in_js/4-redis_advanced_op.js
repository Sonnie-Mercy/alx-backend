import { createClient, print } from 'redis';

const redisClient = createClient();

// Handle successful connection
redisClient.on('connect', function() {
  console.log('Redis client connected to the server');
});

// Handle connection error
redisClient.on('error', function(error) {
  console.log(`Redis client not connected to the server: ${error}`);
});

// Set multiple key-value pairs in the HolbertonSchools hash
redisClient.hset('HolbertonSchools', 'Portland', '50', print);
redisClient.hset('HolbertonSchools', 'Seattle', '80', print);
redisClient.hset('HolbertonSchools', 'New York', '20', print);
redisClient.hset('HolbertonSchools', 'Bogota', '20', print);
redisClient.hset('HolbertonSchools', 'Cali', '40', print);
redisClient.hset('HolbertonSchools', 'Paris', '2', print);

// Retrieve and display all key-value pairs from HolbertonSchools
redisClient.hgetall('HolbertonSchools', function (error, result) {
  if (error) {
    console.log(error);
    throw error;
  }
  console.log(result);
});
