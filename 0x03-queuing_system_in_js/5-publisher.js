import { createClient } from 'redis';

const publisher = createClient();

// Connect to Redis server
publisher.on('connect', function () {
    console.log('Redis client connected to the server');
});

publisher.on('error', function(error) {
    console.log(`Redis client not connected to the server: ${error.message}`);
});

// Function to publish a message to the 'holberton school channel'
function publishMessage(message, time) {
  // Wait for 'time' milliseconds before publishing 'message'
  setTimeout(function () {
    console.log(`About to send ${message}`);
    publisher.publish('holberton school channel', message);
  }, time);
}

// Publish messages at different intervals
publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);
