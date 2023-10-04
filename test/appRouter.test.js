import { expect } from 'chai';
import express from 'express';
import request from 'supertest';
import AppRouter from '../src/Back-end/routes/AppRouter.js';

describe('API Tests', () => {
  let app;

  before(() => {
    app = express();
    app.use(express.json());
    app.use('/', AppRouter.appRouter);
  });

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

        expect(leadTimeObject.days).to.equal(expectedDays);
        expect(leadTimeObject.hours).to.equal(expectedHours);
        expect(leadTimeObject.minutes).to.equal(expectedMinutes);
        expect(leadTimeObject.seconds).to.equal(expectedSeconds);

        done();
      });
  });

  it('should return an error for an invalid issue number', (done) => {
    request(app)
      .get('/lead-time?issueId=0') // invalid issue number
      .expect(400) // You can use an appropriate HTTP status code for this case
      .end((err, res) => {
        if (err) return done(err);

        // Check that the response contains an error message or structure
        // Replace with your actual error checking logic
        expect(res.body.errors[0].type).to.equal("NOT_FOUND"); // Customize this based on your error response structure

        done();
      });
  });
});
