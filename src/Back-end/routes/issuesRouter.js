import express from 'express';
import { getIssue, getIssues, getLeadTimeIssue, getLeadTimeIssuesByPeriod, getNbIssueCompletedInTimeframe, 
        getNbIssuesPerColumn, recordLeadTimeIssue} from '../controller/issuesController.js';

const issuesRouter = express.Router();

issuesRouter.get('/issues', async (req, res) => {
    res.json(await getIssues());
});

issuesRouter.get('/issues/:id', async (req, res) => {
    res.json(await getIssue(req.params.id));
});

issuesRouter.route('/issues_count/:column_name').get(getNbIssuesPerColumn);

issuesRouter.route('/issues_count/:startDate/:endDate').get(getNbIssueCompletedInTimeframe);

issuesRouter.route('/issues/leadTime/:id').get(getLeadTimeIssue);
        
issuesRouter.route('/issues/leadTime/:id').post(recordLeadTimeIssue);

issuesRouter.route('/issues/leadTime/:startDate/:endDate').get(getLeadTimeIssuesByPeriod);

export default issuesRouter;





