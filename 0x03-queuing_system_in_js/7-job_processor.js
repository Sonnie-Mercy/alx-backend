import { createQueue } from 'kue';

// List of blacklisted phone numbers
const blacklist = ['4153518780', '4153518781'];

const queue = createQueue(); // Create a queue for processing jobs

// Function to send a notification, handles job progress and blacklist validation
function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100); // Set initial job progress to 0%
  
  // Check if the phone number is blacklisted
  if (blacklist.includes(phoneNumber)) {
    // Mark the job as failed if the phone number is blacklisted
    done(Error(`Phone number ${phoneNumber} is blacklisted`));
    return;
  }

  job.progress(50, 100); // Update job progress to 50% after validation
  
  // Simulate sending the notification
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  
  done(); // Mark the job as complete
}

// Process the 'push_notification_code_2' jobs, handling two jobs at a time
queue.process('push_notification_code_2', 2, function(job, done) {
  // Pass job data to sendNotification function
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
