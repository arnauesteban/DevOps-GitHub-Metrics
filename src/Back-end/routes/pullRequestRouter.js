import express from 'express';
import {  getPullRequest, getPullRequestLeadTime, getPullRequests, getPullRequestsByAuthor, getPullRequestsMeanTime, getPullRequestsOpenPercentage, getPullRequestsSuccessfulPercentage, recordPullRequestLeadTime } from '../controller/prController.js';

const pullRequestRouter = express.Router();

/**
 * @swagger
 * /pullRequests:
 *  get:
 *      summary: list of all pull requests created in the project
 *      responses:
 *          200: 
 *              description: list of all pull requests in the current project
 *              content:
 *                  application/json:
 *                      items:
 *                          nodes:
 *                              Array:
 *                                  items:
 *                                      application/json:
 *                                          properties:
 *                                              id:
 *                                                  type: string
 *                                                  description: id of the issue inside of GitHub
 *                                              number:
 *                                                  type: int
 *                                                  description: number given to a pull request when it is created. In this API we use this number as the ID.
 *                                              title:
 *                                                  type: string
 *                                                  description: brief description of the pr.
 *                                              state:
 *                                                  type: string
 *                                                  description: state of the PR, opened, closed, merged, ect...
 *                                              createdAt:
 *                                                  type: date
 *                                                  description: date and time of creation of the pr.
 *                                              closedAt:
 *                                                  type: date
 *                                                  description: date and time of closing of the pr.
 *                                              author:
 *                                                  application/json:
 *                                                      items:
 *                                                          properties:
 *                                                              login:
 *                                                                  type: string
 *                                                                  description: name of the author that created the pr.
 */
pullRequestRouter.get('/pullRequests', async (req, res) => {
    res.json(await getPullRequests());
});

/**
 * @swagger
 * /pullRequests/{id}:
 *  get:
 *      summary: retrieves the pr with its id (pr number)
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The id of the pr (for this api we use issue number as its id)
 *      responses:
 *          200: 
 *              description: retrieves one pr with the pr number
 *              content:
 *                  application/json:
 *                      items:
 *                          properties:
 *                              number:
 *                                  type: int
 *                                  description: number of the issue inside Github, we use this number as the id in this API
 *                              title:
 *                                  type: string
 *                                  description: brief description of the pr
 *                              createdAt:
 *                                  type: date
 *                                  description: date of creation of the pr
 *                              closedAt:
 *                                  type: date
 *                                  description: date of closing of the pr
 */
pullRequestRouter.get('/pullRequests/:id', async (req, res) => {
    res.json(await getPullRequest(req.params.id));
});

/**
 * @swagger
 * /pullRequests/leadtime/{id}:
 *  get:
 *      summary: retrieves the lead time of the pr with its id (pr number)
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The id of the pr (for this api we use issue number as its id)
 *      responses:
 *          200: 
 *              description: retrieves the lead time of one pr with the pr number
 *              content:
 *                  application/json:
 *                      items:
 *                          properties:
 *                              pullRequestID:
 *                                  type: int
 *                                  description: number of the issue inside Github, we use this number as the id in this API
 *                              title:
 *                                  type: string
 *                                  description: brief description of the pr
 *                              Timestamp:
 *                                  type: date
 *                                  description: date and time of the calling of the route
 *                              LeadTime:
 *                                  type: string
 *                                  description: Total lead time in days, hours, minutes and seconds of the pr
 */
pullRequestRouter.get('/pullRequests/leadTime/:id', async (req, res) =>{
    let pullRequestLeadTime = await getPullRequestLeadTime(req, res);
    recordPullRequestLeadTime(pullRequestLeadTime);
    res.json(pullRequestLeadTime);
});

/**
 * @swagger
 * /pullRequests/metrics/success_rate:
 *  get:
 *      summary: get the overall success rate of pullrequests inside the project
 *      responses:
 *          200: 
 *              description: gives the total count of pr and the count of the pr that was merged successfully and the calculated percentage
 *              content:
 *                  application/json:
 *                      items:
 *                          properties:
 *                              successfulPullRequests:
 *                                  type: int
 *                                  description: count of successful PRs
 *                              totalClosedPullRequests:
 *                                  type: int
 *                                  description: count of closed PRs
 *                              successfulPullRequestsPercentage:
 *                                  type: int
 *                                  description: percentage of PRs that were successfully merged.
 */
pullRequestRouter.route('/pullRequests/metrics/success_rate').get(getPullRequestsSuccessfulPercentage);

/**
 * @swagger
 * /pullRequests/metrics/mean_time/{count}:
 *  get:
 *      summary: get the overall success rate of pullrequests inside the project
 *      parameters:
 *          -   in: path
 *              name: count
 *              schema:
 *                  type: string
 *              required: true
 *              description: The count of the pr that you want to pool the average from (for this the count will be taken in the order of their creation until the number of prs matches the wanted count)
 *      responses:
 *          200: 
 *              description: gives the mean lead time of a pool of PRs
 *              content:
 *                  application/json:
 *                      items:
 *                          properties:
 *                              days:
 *                                  type: int
 *                                  description: number of days this pool of PRs takes to be completed in average
 *                              hours:
 *                                  type: int
 *                                  description: number of hours this pool of PRs takes to be completed in average
 *                              minutes:
 *                                  type: int
 *                                  description: number of minutes this pool of PRs takes to be completed in average
 *                              seconds:
 *                                  type: int
 *                                  description: number of seconds this pool of PRs takes to be completed in average
 */
pullRequestRouter.route('/pullRequests/metrics/mean_time/:count').get(getPullRequestsMeanTime);

/**
 * @swagger
 * /pullRequests/metrics/authors:
 *  get:
 *      summary: get the overall success rate of pullrequests inside the project
 *      responses:
 *          200: 
 *              description: gives the total count of pr and the count of the pr that was merged successfully and the calculated percentage
 *              content:
 *                  application/json:
 *                      items:
 *                          properties:
 *                              TotalPullRequests:
 *                                  type: int
 *                                  description: count of successful PRs
 *                              Authors:
 *                                  array:
 *                                      items:
 *                                          application/json:
 *                                              items:
 *                                                  properties:
 *                                                      author:
 *                                                          type: string
 *                                                          description: name of the author that made the pr.
 *                                                      pullRequestCount: 
 *                                                          type: int
 *                                                          description: Count of PRs made by the specified author
 *                                                      pullRequestPercentage:
 *                                                          type: float
 *                                                          description: percentage of PRs contributed by the specified author.
 */
pullRequestRouter.route('/pullRequests/metrics/authors').get(getPullRequestsByAuthor);

/**
 * @swagger
 * /pullRequests/metrics/opened_rate:
 *  get:
 *      summary: get the overall success rate of pullrequests inside the project
 *      responses:
 *          200: 
 *              description: gives the total count of pr and the count of the pr that was merged successfully and the calculated percentage
 *              content:
 *                  application/json:
 *                      items:
 *                          properties:
 *                              openPullRequests:
 *                                  type: int
 *                                  description: count of successful PRs
 *                              totalPullRequests:
 *                                  type: int
 *                                  description: count of closed PRs
 *                              openPullRequestsPercentage:
 *                                  type: int
 *                                  description: percentage of PRs that were successfully merged.
 */
pullRequestRouter.route('/pullRequests/metrics/opened_rate').get(getPullRequestsOpenPercentage);

pullRequestRouter.route('/pullRequests/leadTime/:id').post(recordPullRequestLeadTime);

export default pullRequestRouter;

