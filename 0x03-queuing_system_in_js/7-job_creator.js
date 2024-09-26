import { createQueue } from 'kue';

// List of jobs containing phone numbers and messages to send
const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  // Additional job objects with phone numbers and messages
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  // (Other jobs omitted for brevity)
];

const queue = createQueue(); // Create a queue for processing jobs

// Loop through each job in the jobs array and create a new job in the queue
jobs.forEach((myJob) => {
  let job = queue.create('push_notification_code_2', myJob).save((error) => {
    if (!error) console.log(`Notification job created: ${job.id}`); // Log successful job creation
  });

  // Event listener for when the job completes
  job.on('complete', function() {
    console.log(`Notification job ${job.id} completed`);
  }).on('failed', function(error) {
    // Event listener for when the job fails
    console.log(`Notification job ${job.id} failed: ${error}`);
  }).on('progress', function(progress, data) {
    // Event listener for tracking job progress
    console.log(`Notification job ${job.id} ${progress}% complete`);
  });
});
