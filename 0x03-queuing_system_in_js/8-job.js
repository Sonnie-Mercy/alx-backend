export default function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  jobs.forEach((jobData) => {
    const job = queue.create('push_notification_code_3', jobData);

    job
      .on('enqueue', () => {
        console.log(`Notification job created: ${job.id || 'Test Mode (no ID)'}`);
      })
      .on('complete', () => {
        console.log(`Notification job ${job.id || 'Test Mode (no ID)'} completed`);
      })
      .on('failed', (err) => {
        console.log(`Notification job ${job.id || 'Test Mode (no ID)'} failed: ${err}`);
      })
      .on('progress', (progress) => {
        console.log(`Notification job ${job.id || 'Test Mode (no ID)'} ${progress}% complete`);
      });

    job.save();
  });
}
