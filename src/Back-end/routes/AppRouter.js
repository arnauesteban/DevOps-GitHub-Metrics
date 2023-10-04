import express from 'express';
import {sendGitHubQuery, github_data} from '../utils/github-config.js'

class AppRouter{
    constructor(){
        this.appRouter = express.Router();
        this.init();
    }

    init(){
        this.appRouter.get('/', this.goToIndex.bind(this));
        this.appRouter.get('/lead-time', this.getLeadTimeIssue.bind(this));
        this.appRouter.get('/lead-time-period', this.getLeadTimeIssuesByPeriod.bind(this));
    }

    goToIndex(req, res)
    {
        res.redirect('/log680/v1/pageAcceuil');
    }

    calculateLeadTime(createdAt, closedAt)
    {
        var leadTimeInMilliseconds = closedAt - createdAt;

        // Converts leadTimeInMilliseconds into days:hours:seconds
        const seconds = Math.floor(leadTimeInMilliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;

        // Generates the response object
        const leadTimeObject = {
            days : days,
            hours : remainingHours,
            minutes : remainingMinutes,
            seconds : remainingSeconds
        };

        return leadTimeObject;
    }

    getLeadTimeIssue(req, res)
    {
        const issueId = req.query.issueId; // Get the value of the parameter of the GET request
        
        //Gets the start and close time of the issue
        const query = `
        query {
            repository(owner: "arnauesteban", name: "labo-devops-g14-a23") {
              issue(number: ${issueId}) {
                title
                createdAt
                closedAt
              }
            }
          }
        `;
        
        //Calculates the lead time
        sendGitHubQuery(query)
        .then(data => {
            console.log("Réponse de l'API de GitHub pour le lead time d'une issue ", JSON.stringify(data));

            //If the issue does not exist, we return the data, which contains the error
            if(data.data.repository.issue == null)
            {
                res.status(400).json(data);
                return;
            }

            var createdAt = new Date(data.data.repository.issue.createdAt);
            var closedAt = new Date(data.data.repository.issue.closedAt);

            const leadTimeObject = this.calculateLeadTime(createdAt, closedAt);

            console.log("Lead time : " + leadTimeObject["days"] + "days " 
            + leadTimeObject["hours"] + "hours " + leadTimeObject["minutes"] + "min " + leadTimeObject["seconds"] + "sec");

            res.json(leadTimeObject);

        })
        .catch(error => {
            console.error("Error:", error.message);
        });

    }


    getLeadTimeIssuesByPeriod(req, res)
    {
        
        //Gets the issues in ascending order based on its closing date
        const query = `
        query {
            repository(owner: "${github_data.username}", name: "${github_data.repo}") {
              issues(
                states : CLOSED
                first: 100
              ) {
                nodes {
                  number
                  title
                  createdAt
                  closedAt
                }
              }
            }
          }
        `;

        // Gets the start and end dates
        var startDate = new Date(req.query.startDate);
        var endDate = new Date(req.query.endDate);
        //Correction to the time to ensure a good performance
        endDate.setHours(endDate.getHours()+23, 59);
        
        
        //Calculates the lead time
        sendGitHubQuery(query)
        .then(data => {
            console.log("Réponse de l'API de GitHub pour le lead time des issues: \n", JSON.stringify(data));

            // Filters the issues closed within the start and end dates
            const issuesWithinRange = data.data.repository.issues.nodes.filter((issue) => {
                const closedDate = new Date(issue.closedAt);
                return closedDate.getTime() >= startDate.getTime() && closedDate.getTime() <= endDate.getTime();
            });
            
            console.log("issuesWithinRange: \n" + issuesWithinRange);

            //Creates the list of issues with its lead time
            const issues = []
            issuesWithinRange.forEach((i) => {
                console.log(i);
                const leadTimeObject = this.calculateLeadTime(new Date(i.createdAt), new Date(i.closedAt));
                issues.push({
                    number : i.number,
                    title : i.title,
                    leadTime : leadTimeObject
                });
            });

            res.json(issues);

        })
        .catch(error => {
            console.error("Error:", error.message);
        });

    }
}

const appRouter = new AppRouter();
appRouter.init()

export default appRouter;