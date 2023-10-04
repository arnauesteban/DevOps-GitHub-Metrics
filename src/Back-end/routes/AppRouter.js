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
    }

    goToIndex(req, res)
    {
        res.redirect('/log680/v1/pageAcceuil');
    }

    getLeadTimeIssue(req, res)
    {
        const issueId = req.query.issueId; // Get the value of the parameter of the GET request
        
        //Gets the start and close time of the issue
        const query = `
        query {
            repository(owner: "arnauesteban", name: "labo-devops-g14-a23") {
              issue(number: 7) {
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
            console.log("Réponse de l'API de GitHub pour le lead time d'une issue:\n", JSON.stringify(data));
            
            var createdAt = new Date(data.data.repository.issue.createdAt);
            var closedAt = new Date(data.data.repository.issue.closedAt);

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

            console.log("Lead time : " + leadTimeObject["days"] + "days " 
            + leadTimeObject["hours"] + "hours " + leadTimeObject["minutes"] + "min " + leadTimeObject["seconds"] + "sec");

            res.json(leadTimeObject);

        })
        .catch(error => {
            console.error("Error:", error.message);
        });

    }
}

const appRouter = new AppRouter();
appRouter.init()

export default appRouter;