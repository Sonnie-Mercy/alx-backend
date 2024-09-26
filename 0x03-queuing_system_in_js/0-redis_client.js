// the import
import { createClient } from 'redis';

// the function to use
function redisConnect() {
  const client = createClient();

  client.on('connect', function() {
    console.log('Redis client connected to the server');
  }).on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err}`);
  });

};

redisConnect();
