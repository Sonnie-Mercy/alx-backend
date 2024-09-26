// Import the necessary kue module for creating job queues
import kue from 'kue';

// Function to create jobs for push notifications
function createPushNotificationsJobs(jobs, queue) {
  // Throw an error if jobs is not an array
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  // Loop through each job object in the jobs array
  jobs.forEach((jobData) => {
    // Create a new job in the 'push_notification_code_3' queue
    const job = queue.create('push_notification_code_3', jobData).save((error) => {
      if (!error) {
        // Log when a job is successfully created
        console.log(`Notification job created: ${job.id}`);
      }
    });

    // Listen for job completion and log to the console
    job.on('complete', function() {
      console.log(`Notification job ${job.id} completed`);
    });

    // Listen for job failure and log the error message
    job.on('failed', function(error) {
      console.log(`Notification job ${job.id} failed: ${error}`);
    });

    // Listen for job progress and log the percentage of completion
    job.on('progress', function(progress) {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
  });
}

// Export the function to be used in other files
export default createPushNotificationsJobs;
