// Import required modules: express for the server, kue for job queuing, redis for Redis interaction, and promisify for async Redis calls
import express from 'express';
import kue from 'kue';
import { createClient } from 'redis';
import { promisify } from 'util';

// Initialize Redis client
const client = createClient();
const getAsync = promisify(client.get).bind(client); // Promisify the Redis GET function

// Initialize Kue queue
const queue = kue.createQueue();

// Initialize Express server and set port
const app = express();
const port = 1245;

// Initialize seat count and reservation control flag
let reservationEnabled = true; // Controls if reservations are allowed
const initialAvailableSeats = 50; // Initial seat count

// Set initial number of available seats in Redis when the app starts
reserveSeat(initialAvailableSeats);

// Function to reserve seats (store in Redis)
function reserveSeat(number) {
  client.set('available_seats', number); // Set the available seats in Redis with key 'available_seats'
}

// Async function to get the current available seats from Redis
async function getCurrentAvailableSeats() {
  const seats = await getAsync('available_seats'); // Retrieve available seats from Redis
  return seats ? parseInt(seats, 10) : 0; // Parse the result as an integer or return 0 if no value is set
}

// Route to get the current number of available seats
app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats(); // Get current available seats
  res.json({ numberOfAvailableSeats: availableSeats }); // Return available seats in JSON format
});

// Route to reserve a seat (creates and queues a job)
app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    // If reservation is disabled, return a blocked status
    res.json({ status: 'Reservation are blocked' });
    return;
  }

  // Create a new job in the reserve_seat queue
  const job = queue.create('reserve_seat').save((err) => {
    if (!err) {
      // If the job is created successfully, respond with reservation in process
      res.json({ status: 'Reservation in process' });
    } else {
      // If there's an error creating the job, respond with a failure status
      res.json({ status: 'Reservation failed' });
    }
  });

  // Job event handlers for completion, failure, and progress tracking
  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`); // Log job completion
  });

  job.on('failed', (errorMessage) => {
    console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`); // Log job failure
  });
});

// Route to process the queue and reserve seats
app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' }); // Respond immediately with queue processing status

  // Process the jobs in the reserve_seat queue
  queue.process('reserve_seat', async (job, done) => {
    const currentSeats = await getCurrentAvailableSeats(); // Get current available seats from Redis

    if (currentSeats <= 0) {
      // If no seats are available, fail the job with an error
      done(new Error('Not enough seats available'));
      return;
    }

    // Decrease the number of available seats by 1
    const newSeats = currentSeats - 1;
    reserveSeat(newSeats); // Update the available seats in Redis

    if (newSeats === 0) {
      reservationEnabled = false; // If no seats remain, disable further reservations
    }

    done(); // Mark the job as completed successfully
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
