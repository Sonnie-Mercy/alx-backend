import kue from 'kue';

// Create the queue
const queue = kue.createQueue();

// Define the function to send notifications
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Process jobs in the queue
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});

// Handle connection and error events
queue.on('error', (err) => {
  console.log(`Queue error: ${err.message}`);
});

console.log('Waiting for jobs...');
