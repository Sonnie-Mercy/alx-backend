import redis from 'redis';

// Create a Redis client
const client = redis.createClient();

// Connect to Redis and log a message
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Create Hash
function createHash() {
  client.hset('ALX', 'Portland', 50, redis.print);
  client.hset('ALX', 'Seattle', 80, redis.print);
  client.hset('ALX', 'New York', 20, redis.print);
  client.hset('ALX', 'Bogota', 20, redis.print);
  client.hset('ALX', 'Cali', 40, redis.print);
  client.hset('ALX', 'Paris', 2, redis.print);
}

// Display Hash
function displayHash() {
  client.hgetall('ALX', (err, reply) => {
    if (err) {
      console.error(`Error fetching hash: ${err.message}`);
      return;
    }
    console.log(reply);
  });
}

// Call the functions
createHash();
displayHash();
