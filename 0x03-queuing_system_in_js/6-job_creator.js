import { createQueue } from 'kue';

const queue = createQueue(); // Create a new Kue queue instance

// Define the notification details
const notification = {
  'phoneNumber': '25427272727',
  'message': 'This is the code to verify your account'
}

// Create a new job in the 'push_notification_code' queue with the notification data
const job = queue.create('push_notification_code', notification).save(function (error) {
  if (!error) {
    // Log job ID when the job is successfully created
    console.log(`Notification job created: ${job.id}`);
  }
});

// Listen for job completion and failure events
job.on('complete', function() {
    console.log('Notification job completed'); // Log when the job is successfully completed
}).on('failed', function() {
    console.log('Notification job failed'); // Log if the job fails
});
