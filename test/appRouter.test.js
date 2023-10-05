import { expect } from 'chai';
import express from 'express';
import request from 'supertest';
import AppRouter from '../src/Back-end/routes/AppRouter.js';

function checkLeadTime(leadTimeObject, expectedDays, expectedHours, expectedMinutes, expectedSeconds)
{
  expect(leadTimeObject.days).to.equal(expectedDays);
  expect(leadTimeObject.hours).to.equal(expectedHours);
  expect(leadTimeObject.minutes).to.equal(expectedMinutes);
  expect(leadTimeObject.seconds).to.equal(expectedSeconds);
}

describe('API Tests', () => {
  let app;

  before(() => {
    app = express();
    app.use(express.json());
    app.use('/', AppRouter.appRouter);
  });

  //TEST GET LEAD TIME OF AN ISSUE

  it('should calculate lead time for an issue', (done) => {
    request(app)
      .get('/lead-time?issueId=7')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const leadTimeObject = res.body;

        // Replace these expected values with the actual expected values based on your test data
        const expectedDays = 0;
        const expectedHours = 0;
        const expectedMinutes = 23;
        const expectedSeconds = 59;

        checkLeadTime(leadTimeObject, expectedDays, expectedHours, expectedMinutes, expectedSeconds)

        done();
      });
  });

  it('should return an error for an invalid issue number', (done) => {
    request(app)
      .get('/lead-time?issueId=0') // invalid issue number
      .expect(404) // You can use an appropriate HTTP status code for this case
      .end((err, res) => {
        if (err) return done(err);

        // Check that the response contains an error message or structure
        // Replace with your actual error checking logic
        expect(res.body.errors[0].type).to.equal("NOT_FOUND"); // Customize this based on your error response structure

        done();
      });
  });

  it('should return a 405 error: issue still open', (done) => {
    request(app)
      .get('/lead-time?issueId=5') // issues still open
      .expect(405) // You can use an appropriate HTTP status code for this case
      .end((err, res) => {
        if (err) return done(err);
        // Check that the response contains an error message or structure
        // Replace with your actual error checking logic
        expect(res.body.data.repository.issue.closedAt).to.equal(null); // Customize this based on your error response structure

        done();
      });
  });

  //TEST OF LEAD TIME OF ISSUES OF A GIVEN PERIOD
  it('should calculate lead time of issues of the 3th october 2023', (done) => {
    request(app)
      .get('/lead-time-period?startDate=2023-10-03&endDate=2023-10-03')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const issuesObject = res.body;
        
        checkLeadTime(issuesObject[0].leadTime, 0, 20, 20, 58);
        checkLeadTime(issuesObject[1].leadTime, 0, 5, 54, 46);
        checkLeadTime(issuesObject[2].leadTime, 0, 0, 23, 59);

        done();
      });
  });


  //TEST GET LEAD TIME OF A PULL REQUEST
  it('should calculate lead time for a pull request', (done) => {
    request(app)
      .get('/lead-time-pull-request?id=2')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const leadTimeObject = res.body;

        // Replace these expected values with the actual expected values based on your test data
        const expectedDays = 0;
        const expectedHours = 0;
        const expectedMinutes = 7;
        const expectedSeconds = 20;

        checkLeadTime(leadTimeObject, expectedDays, expectedHours, expectedMinutes, expectedSeconds)

        done();
      });
  });

  it('should return an error for an invalid issue number', (done) => {
    request(app)
      .get('/lead-time-pull-request?id=0') // invalid issue number
      .expect(404) // You can use an appropriate HTTP status code for this case
      .end((err, res) => {
        if (err) return done(err);

        // Check that the response contains an error message or structure
        // Replace with your actual error checking logic
        expect(res.body.errors[0].type).to.equal("NOT_FOUND"); // Customize this based on your error response structure

        done();
      });
  });

});
