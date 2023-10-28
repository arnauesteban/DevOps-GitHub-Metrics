import express from 'express';
import {  getPullRequest, getPullRequestLeadTime, getPullRequests, getPullRequestsByAuthor, getPullRequestsMeanTime, getPullRequestsOpenPercentage, getPullRequestsSuccessfulPercentage, recordPullRequestLeadTime } from '../controller/prController.js';

const pullRequestRouter = express.Router();

pullRequestRouter.get('/pullRequests', async (req, res) => {
    res.json(await getPullRequests());
});

pullRequestRouter.get('/pullRequests/:id', async (req, res) => {
    res.json(await getPullRequest(req.params.id));
});

pullRequestRouter.route('/pullRequests/leadTime/:id').get(getPullRequestLeadTime);

pullRequestRouter.route('/pullRequests/leadTime/:id').post(recordPullRequestLeadTime);

pullRequestRouter.route('/pullRequests/metrics/success_rate').get(getPullRequestsSuccessfulPercentage);

pullRequestRouter.route('/pullRequests/metrics/mean_time/:count').get(getPullRequestsMeanTime);
        
pullRequestRouter.route('/pullRequests/metrics/authors').get(getPullRequestsByAuthor);

pullRequestRouter.route('/pullRequests/metrics/opened_rate').get(getPullRequestsOpenPercentage);

export default pullRequestRouter;

