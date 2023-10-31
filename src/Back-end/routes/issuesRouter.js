import express from 'express';
import { getIssue, getIssues, getLeadTimeIssue, getLeadTimeIssuesByPeriod, getNbIssueCompletedInTimeframe, 
        getNbIssuesPerColumn, recordLeadTimeIssue} from '../controller/issuesController.js';

const issuesRouter = express.Router();

/**
 * @swagger
 * /issues:
 *  get:
 *      summary: list of all issues created in the project
 *      responses:
 *          200: 
 *              description: list of all issue in the current project
 *              content:
 *                  Array:
 *                      items:
 *                          application/json:
 *                              items:
 *                                  properties:
 *                                      content:
 *                                          application/json:
 *                                              items:
 *                                                  properties:
 *                                                      id:
 *                                                          type: int
 *                                                          description: ID of the issue inside Github
 *                                                      number:
 *                                                          type: int
 *                                                          description: issue number, used as id for the purpose of this program
 *                                                      title:
 *                                                          type: string
 *                                                          description: title of the issue giving us a brief description of the issue
 *                                                      state:
 *                                                          type: string
 *                                                          description: current state of the issue (open or closed)
 *                                                      createdAt:
 *                                                          type: date
 *                                                          description: date of creation of the issue
 *                                                      closedAt:
 *                                                          type: date
 *                                                          description: date of completion of the issue
 *                                      status:
 *                                          application/json:
 *                                              items:
 *                                                  properties:
 *                                                      column:
 *                                                          type: string
 *                                                          description: column in which the issue is in                         
 */
issuesRouter.get('/issues', async (req, res) => {
    res.json(await getIssues());
});

/**
 * @swagger
 * /issues/{id}:
 *  get:
 *      summary: get the issue by by id (issue number)
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The id of the issue (for this api we use issue number as its id)
 *      responses:
 *          200: 
 *              description: retrieves all the information of the issue
 *              content:
 *                  application/json:
 *                      items:
 *                          properties:
 *                              id:
 *                                  type: int
 *                                  description: ID of the issue inside Github
 *                              number:
 *                                  type: int
 *                                  description: issue number, used as id for the purpose of this program
 *                              title:
 *                                  type: string
 *                                  description: title of the issue giving us a brief description of the issue
 *                              createdAt:
 *                                  type: date
 *                                  description: date of creation of the issue
 *                              closedAt:
 *                                  type: date
 *                                  description: date of completion of the issue
 *                              labels:
 *                                  application/json:
 *                                      items:
 *                                          properties:
 *                                              nodes:
 *                                                  type: array
 *                                                  items:
 *                                                      application/json:
 *                                                          items:
 *                                                              properties:
 *                                                                  name:
 *                                                                      type: string
 *                                                                      description: label name assigned on the issue
 *                              body:
 *                                  type: string
 *                                  description: Full Content of the issue                           
 */
issuesRouter.get('/issues/:id', async (req, res) => {
    res.json(await getIssue(req.params.id));
});

/**
 * @swagger
 * /issues/leadtime/{id}:
 *  get:
 *      summary: get the leadtime of an issue
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The id of the issue (for this api we use issue number as its id)
 *      responses:
 *          200:
 *              description: retrieves the issue and calculates its leadtime in days, hours, minutes and seconds
 *              content:
 *                  application/json:
 *                      items:
 *                          properties:
 *                              IssueID:
 *                                  type: int
 *                                  description: The number of the issue (in this api we use it as the id instead of the true id provided by github)
 *                              Title:
 *                                  type: string
 *                                  description: Title of the issue, gives us a brief description of the issue.
 *                              Timestamp:
 *                                  type: date
 *                                  description: time and date at which the route was called.
 *                              LeadTime:
 *                                  application/json:
 *                                      items:
 *                                          properties:
 *                                              days:
 *                                                  type: int
 *                                                  description: number of days the issue passed in leadtime
 *                                              hours:
 *                                                  type: int
 *                                                  description: number of hours the issue passed in leadtime
 *                                              minutes:
 *                                                  type: int
 *                                                  description: number of minutes the issue passed in leadtime
 *                                              seconds:
 *                                                  type: int
 *                                                  description: number of seconds the issue passed in leadtime
 */
issuesRouter.get('/issues/leadTime/:id', async (req, res) =>{
    let issueLeadTime = await getLeadTimeIssue(req, res);
    recordLeadTimeIssue(issueLeadTime);
    res.json(issueLeadTime);
});

/**
 * @swagger
 * /issues/leadtime/{startDate}/{endDate}:
 *  get:
 *      summary: get the leadtime of an issue
 *      parameters:
 *          -   in: path
 *              name: startDate
 *              schema:
 *                  type: string
 *              required: true
 *              description: The date at which the issue was started
 *          -   in: path
 *              name: endDate
 *              schema:
 *                  type: string
 *              required: true
 *              description: The date at which the issue was closed or merged
 *      responses:
 *          200:
 *              description: retrieves the issue and calculates its leadtime in days, hours, minutes and seconds
 *              content:
 *                  array:
 *                      items:
 *                          application/json:
 *                              items:
 *                                  properties:
 *                                      number:
 *                                          type: int
 *                                          description: The number of the issue (in this api we use it as the id instead of the true id provided by github)
 *                                      title:
 *                                          type: string
 *                                          description: Title of the issue, gives us a brief description of the issue.
 *                                      leadTime:
 *                                          application/json:
 *                                              items:
 *                                                  properties:
 *                                                      days:
 *                                                          type: int
 *                                                          description: number of days the issue passed in leadtime
 *                                                      hours:
 *                                                          type: int
 *                                                          description: number of hours the issue passed in leadtime
 *                                                      minutes:
 *                                                          type: int
 *                                                          description: number of minutes the issue passed in leadtime
 *                                                      seconds:
 *                                                          type: int
 *                                                          description: number of seconds the issue passed in leadtime
 */
issuesRouter.route('/issues/leadTime/:startDate/:endDate').get(getLeadTimeIssuesByPeriod);

/**
 * @swagger
 * /issues/count/{column_name}:
 *  get:
 *      summary: get the total count of issues inside a column
 *      parameters:
 *          -   in: path
 *              name: column_name
 *              schema:
 *                  type: string
 *              required: true
 *              description: column name of the project we want the issues count from.
 *      responses:
 *          200:
 *              description: retrieves the count of issues inside a column
 *              content:
 *                  application/json:
 *                      items:
 *                          properties:
 *                              columnName:
 *                                  type: string
 *                                  description: column name of the project we want the issues count from.
 *                              IssuesNumber:
 *                                  type: int
 *                                  description: Number of issues inside the specified column
 */
issuesRouter.route('/issues/count/:column_name').get(getNbIssuesPerColumn);

/**
 * @swagger
 * /issues/count/{startDate}/{endDate}:
 *  get:
 *      summary: get the total count of issues inside a column
 *      parameters:
 *          -   in: path
 *              name: startDate
 *              schema:
 *                  type: string
 *              required: true
 *              description: Start date of the timeframe you want to see the open issues from.
 *          -   in: path
 *              name: endDate
 *              schema:
 *                  type: string
 *              required: true
 *              description: End date of the timeframe you want to see the open issues from.
 *      responses:
 *          200:
 *              description: retrieves the count of open issues within a timefraom
 *              content:
 *                  application/json:
 *                      items:
 *                          properties:
 *                              fromDate:
 *                                  type: date
 *                                  description: Start date that we want to count the open issues from.
 *                              untilDate:
 *                                  type: date
 *                                  description: End date we want to count the open issues from
 *                              issuesNumber:
 *                                  type: date
 *                                  description: Number of issues within timeframe.
 */
issuesRouter.route('/issues/count/:startDate/:endDate').get(getNbIssueCompletedInTimeframe);

issuesRouter.route('/issues/leadTime/:id').post(recordLeadTimeIssue);

export default issuesRouter;