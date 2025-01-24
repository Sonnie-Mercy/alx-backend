import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';
import kue from 'kue';

// Initialize Redis client
const redisClient = createClient();
const reserveSeat = (number) => redisClient.set('available_seats', number);
const getAsync = promisify(redisClient.get).bind(redisClient);

// Boolean flag for reservation
let reservationEnabled = true;

// Initialize queue
const queue = kue.createQueue();

// Set initial number of seats
const INITIAL_SEATS = 50;
reserveSeat(INITIAL_SEATS);

// Create express server
const app = express();
const PORT = 1245;

// Route: Get available seats
app.get('/available_seats', async (req, res) => {
  const seats = await getAsync('available_seats');
  return res.json({ numberOfAvailableSeats: seats });
});

// Route: Reserve a seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  const job = queue.create('reserve_seat', {}).save((err) => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    res.json({ status: 'Reservation in process' });
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
  });
});

// Route: Process queue
app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const seats = parseInt(await getAsync('available_seats'), 10);

    if (isNaN(seats) || seats <= 0) {
      done(new Error('Not enough seats available'));
      return;
    }

    const newSeats = seats - 1;
    reserveSeat(newSeats);

    if (newSeats === 0) {
      reservationEnabled = false;
    }

    done();
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
