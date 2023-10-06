import express from 'express';
import {sendGitHubQuery, github_data} from '../utils/github-config.js'

class AppRouter{
    constructor(){
        this.appRouter = express.Router();
        this.init();
    }

    init(){
        
        this.appRouter.get('/', this.goToIndex.bind(this));

        /**
         * @swagger
         * /lead-time
         *   get:
         *     description: Obtenir le lead time d'une tâche
         *     parameters:
         *       - name: issueId
         *         in: query
         *         description: L'identifiant de la tâche.
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Réponse réussie.
         *       404:
         *         description: Issue n'existe pas.
         */
        this.appRouter.get('/lead-time', this.getLeadTimeIssue.bind(this));


        /**
         * @swagger
         * /lead-time-period:
         *   get:
         *     description: Obtenir le lead time d'une tâche dans une période donnée
         *     parameters:
         *       - name: startDate
         *         in: query
         *         description: La date minimale.
         *         required: true
         *         schema:
         *           type: string
         *           format: date
         *       - name: endDate
         *         in: query
         *         description: La date finale.
         *         required: true
         *         schema:
         *           type: string
         *           format: date
         *     responses:
         *       200:
         *         description: Réponse réussie.
         */
        this.appRouter.get('/lead-time-period', this.getLeadTimeIssuesByPeriod.bind(this));


        /**
         * @swagger
         * /pull-requests-mean:
         *   get:
         *     description: Obtenir la moyenne du lead time des dernières 'n' pull requests
         *     parameters:
         *       - name: n
         *         in: query
         *         description: Numéro de pull requests.
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Réponse réussie.
         */
        this.appRouter.get('/pull-requests-mean', this.getMeanPullRequests.bind(this));



        /**
         * @swagger
         * /lead-time-pull-request:
         *   get:
         *     description: Obtenir le lead time d'une pull request donnée
         *     parameters:
         *       - name: id
         *         in: query
         *         description: Identifiant du pull request.
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Réponse réussie.
         *       404:
         *         description: La pull request n'existe pas.
         */
        this.appRouter.get('/lead-time-pull-request', this.getLeadTimePullRequest.bind(this));



        /**
         * @swagger
         * /pull-requests-authors:
         *   get:
         *     description: Obtenir le nombre total de pull requests (max. les 1000 derniers), le nombre de pull requests de chaque auteur et son pourcentage de pull requests en fonction du nombre total.
         *     responses:
         *       200:
         *         description: Réponse réussie.
         */
        this.appRouter.get('/pull-requests-authors', this.getPullRequestsByAuthor.bind(this));



        /**
         * @swagger
         * /pull-requests-open-percentage:
         *   get:
         *     description: Obtenir le pourcentage de pull requests qui sont ouvertes comparé au nombre total de pull requests.
         *     responses:
         *       200:
         *         description: Réponse réussie.
         */
        this.appRouter.get('/pull-requests-open-percentage', this.getPullRequestsOpenPercentage.bind(this));



        /**
         * @swagger
         * /pull-requests-successful-percentage:
         *   get:
         *     description: Obtenir le pourcentage de pull requests qui ont été "merged" en fonction du nombre total de pull requests qui ont été fermés (avec merge ou pas)
         *     responses:
         *       200:
         *         description: Réponse réussie.
         */
        this.appRouter.get('/pull-requests-successful-percentage', this.getPullRequestsSuccessfulPercentage.bind(this));


        /**
         * @swagger
         * /metric/snapshot:
         *   get:
         *     description: Obtenir un snapshot de l'état actuel tu tableau Kanban (nombre de tâches pour chaque colonne)
         *       200:
         *         description: Réponse réussie.
         */
        this.appRouter.get('/metric/snapshot', this.getSnapshot.bind(this));
    }

    async getSnapshot(req, res)
    {
        var query = `
        query{
            repository(owner: "arnauesteban", name: "labo-devops-g14-a23") {
              projectV2(number: 2) {
                items(first: 100) {
                  nodes {
                    status: fieldValueByName(name: "Status") {
                      ... on ProjectV2ItemFieldSingleSelectValue {
                        column: name
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        sendGitHubQuery(query)
        .then(data => {
            console.log("Réponse de l'API de GitHub pour le lead time d'une issue ", JSON.stringify(data));

            var snapshot = {};
            data.data.repository.projectV2.items.nodes.forEach((c) => {
                var columnName = c.status.column;
                if(snapshot[columnName])
                {
                    snapshot[columnName]++;
                }
                else
                {
                    snapshot[columnName] = 1;
                }
            });
            
            res.json(snapshot);

        })
        .catch(error => {
            console.error("Error:", error.message);
            res.status(400).json("ERROR");
        });

    }

    goToIndex(req, res)
    {
        res.redirect('/log680/v1/pageAcceuil');
    }

    calculateLeadTime(leadTimeInMilliseconds)
    {
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
            repository(owner: "${github_data.username}", name: "${github_data.repo}") {
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
                res.status(404).json(data);
                return;
            }

            //Checks if the issue is closed
            if(data.data.repository.issue.closedAt == null)
            {
                res.status(405).json(data);
                return;
            }

            var createdAt = new Date(data.data.repository.issue.createdAt);
            var closedAt = new Date(data.data.repository.issue.closedAt);

            const leadTimeObject = this.calculateLeadTime(closedAt - createdAt);

            console.log("Lead time : " + leadTimeObject["days"] + "days " 
            + leadTimeObject["hours"] + "hours " + leadTimeObject["minutes"] + "min " + leadTimeObject["seconds"] + "sec");

            res.json(leadTimeObject);

        })
        .catch(error => {
            console.error("Error:", error.message);
            res.status(400).json("ERROR");
        });

    }


    getLeadTimeIssuesByPeriod(req, res)
    {
        console.log("FEEECHAAASSSS\n");
        console.log(req.query.startDate);
        console.log(req.query.endDate);
        if(req.query.startDate == "" || req.query.endDate == "")
        {
            res.status(400).json("ERROR");
            return;
        }
        
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
        endDate.setHours(endDate.getHours()+23, 59, 59, 59);
        
        
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
                const leadTimeObject = this.calculateLeadTime(new Date(i.closedAt) - new Date(i.createdAt));
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
            res.status(400).json("ERROR");
        });

    }

    getMeanPullRequests(req, res)
    {
        const n = req.query.n;

        var query = `
        query {
            repository(owner: "${github_data.username}", name: "${github_data.repo}") {
              pullRequests(first: ${n}, states: MERGED, orderBy : {field : CREATED_AT, direction :DESC}) {
                edges {
                  node {
                    createdAt
                    mergedAt
                  }
                }
              }
            }
          }
        `;

        sendGitHubQuery(query)
        .then(data => {
            console.log("Réponse de l'API de GitHub pour le lead time des issues: \n", JSON.stringify(data));

            var pr = data.data.repository.pullRequests.edges;
            console.log("pr: \n");
            console.log(pr);
            var sum = 0;
            pr.forEach((i) => {
                var duration = new Date(i.node.mergedAt) - new Date(i.node.createdAt);
                console.log("duration: " + duration);
                sum += duration;
            });

            console.log("Sum:" + sum);

            var mean = sum / n;

            //We obtain the mean separated into days, hours, minutes, seconds by reusing the function calculateLeadTime
            var meanJson = this.calculateLeadTime(mean);

            res.json(meanJson);

        })
        .catch(error => {
            console.error("Error:", error.message);
            res.status(400).json("ERROR");
        });
    }


    getPullRequestsByAuthor(req, res)
    {
        var query = `
        query {
            repository(owner: "${github_data.username}", name: "${github_data.repo}") {
              pullRequests(first: 100, states: [OPEN, CLOSED, MERGED]) {
                totalCount,
                nodes {
                  author {
                    login
                  }
                }
              }
            }
          }
        `;

        sendGitHubQuery(query)
        .then(data => {
            console.log("Réponse de l'API de GitHub pour le lead time des issues: \n", JSON.stringify(data));
            
            // Create an object to track the number of Pull Requests per author
            const prsByAuthor = {};

            // Calculate the total number of Pull Requests and the number of Pull Requests per author
            var totalPRs = data.data.repository.pullRequests.totalCount;
            data.data.repository.pullRequests.nodes.forEach((pr) => {
                const authorLogin = pr.author.login;
                if (prsByAuthor[authorLogin]) {
                    prsByAuthor[authorLogin]++;
                } else {
                    prsByAuthor[authorLogin] = 1;
                }
            });

            // Calculate the percentage of Pull Requests per author relative to the total
            const response = {
                totalPullRequests: totalPRs,
                authors: [],
            };

            for (const authorLogin in prsByAuthor) {
                const prCount = prsByAuthor[authorLogin];
                const percentage = (prCount / totalPRs) * 100;
                response.authors.push({
                    author: authorLogin,
                    pullRequestCount: prCount,
                    percentage: percentage.toFixed(2), // Round to two decimal places
                });
            }

            console.log("Response: \n");
            console.log(response);

            res.json(response);

        })
        .catch(error => {
            console.error("Error:", error.message);
            res.status(400).json("ERROR");
        });
    }


    getPullRequestsOpenPercentage(req, res)
    {
        var query = `
        query {
            repository(owner: "${github_data.username}", name: "${github_data.repo}") {
              openPullRequests: pullRequests(states: [OPEN]) {
                totalCount
              }
              totalPullRequests: pullRequests(states: [OPEN, CLOSED, MERGED]) {
                totalCount
              }
            }
          }
        `;
        
        sendGitHubQuery(query)
        .then(data => {
            console.log("Réponse de l'API de GitHub pour le lead time des issues: \n", JSON.stringify(data));
            
            const response = {};

            const openPRs = data.data.repository.openPullRequests.totalCount;
            const totalPRs = data.data.repository.totalPullRequests.totalCount;

            response.openPullRequests = openPRs;
            response.totalPullRequests = totalPRs;
            response.openPullRequestsPercentage = (openPRs / totalPRs) * 100;

            res.json(response);

        })
        .catch(error => {
            console.error("Error:", error.message);
            res.status(400).json("ERROR");
        });

    }

    getPullRequestsSuccessfulPercentage(req, res)
    {
        var query = `
        query {
            repository(owner: "${github_data.username}", name: "${github_data.repo}") {
              successfulPullRequests: pullRequests(states: [MERGED]) {
                totalCount
              }
              totalClosedPullRequests: pullRequests(states: [CLOSED, MERGED]) {
                totalCount
              }
            }
          }
        `;
        
        sendGitHubQuery(query)
        .then(data => {
            console.log("Réponse de l'API de GitHub pour le lead time des issues: \n", JSON.stringify(data));
            
            const response = {};

            const successfulPullRequests = data.data.repository.successfulPullRequests.totalCount;
            const totalClosedPullRequests = data.data.repository.totalClosedPullRequests.totalCount;

            response.successfulPullRequests = successfulPullRequests;
            response.totalClosedPullRequests = totalClosedPullRequests;
            response.successfulPullRequestsPercentage = (successfulPullRequests / totalClosedPullRequests) * 100;

            res.json(response);

        })
        .catch(error => {
            console.error("Error:", error.message);
            res.status(400).json("ERROR");
        });
    }


    getLeadTimePullRequest(req, res)
    {
        const prId = req.query.id;

        var query = `
        query {
            repository(owner: "${github_data.username}", name: "${github_data.repo}") {
              pullRequest(number: ${prId}) {
                createdAt
                closedAt
              }
            }
          }
        `;
        
        sendGitHubQuery(query)
        .then(data => {
            console.log("Réponse de l'API de GitHub pour le lead time des issues: \n", JSON.stringify(data));
            
            //If the pull request does not exist, we return the data, which contains the error
            if(data.data.repository.pullRequest == null)
            {
                res.status(404).json(data);
                return;
            }

            var startDate = new Date(data.data.repository.pullRequest.createdAt);
            var endDate = new Date(data.data.repository.pullRequest.closedAt);

            var response = this.calculateLeadTime(endDate - startDate);

            res.json(response);

        })
        .catch(error => {
            console.error("Error:", error.message);
            res.status(400).json("ERROR");
        });
    }
}

const appRouter = new AppRouter();
appRouter.init()

export default appRouter;