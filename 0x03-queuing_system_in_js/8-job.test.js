// Import necessary modules from mocha for testing and chai for assertions
import { describe, it, before, after, afterEach } from 'mocha';
import { expect } from 'chai';
import { createQueue } from 'kue';  // Import kue to create a queue for jobs

import createPushNotificationsJobs from './8-job.js';  // Import the function to be tested

const queue = createQueue();  // Initialize the Kue queue

// Define a test suite for the createPushNotificationsJobs function
describe('Test createPushNotificatinsJobs function', function() {
  
  // Before all tests, enter Kue's test mode to avoid actually processing jobs
  before(function () {
    queue.testMode.enter();
  });

  // After each test, clear the queue to avoid interference between tests
  afterEach(function () {
    queue.testMode.clear();
  });

  // After all tests, exit test mode
  after(function () {
    queue.testMode.exit();
  });

  // Test case to check if the function throws an error when input is not an array
  it('display an error message if jobs is not an array', function() {
    // Use expect to assert that an error is thrown when 'job' (a string) is passed instead of an array
    expect(() => createPushNotificationsJobs('job', queue)).to.throw(Error, 'Jobs is not an array');
  });

  // Test case to verify that jobs are created correctly in the queue
  it('Test whether jobs are created', function() {
    // Define an array of job objects
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account'
      },
    ];

    // Call the function to create jobs in the queue
    createPushNotificationsJobs(jobs, queue);

    // Assert that two jobs were created
    expect(queue.testMode.jobs.length).to.equal(2);

    // Assert that the first job's type and data match the expected values
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).to.eql(jobs[0]);

    // Assert that the second job's type and data match the expected values
    expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[1].data).to.eql(jobs[1]);
  });
});
