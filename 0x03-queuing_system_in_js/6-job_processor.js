import { createQueue } from 'kue';

// Create a queue for managing jobs
const queue = createQueue();

// Function to send a notification with the phone number and message
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

// Process jobs in the 'push_notification_code' queue
queue.process('push_notification_code', function(job, done) {
  // Extract data from the job and send the notification
  sendNotification(job.data.phoneNumber, job.data.message);
  done(); // Signal job completion
});
