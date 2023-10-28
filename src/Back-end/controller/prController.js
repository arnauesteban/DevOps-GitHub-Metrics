import QUERY from "../core/QueriesDB.js";
import dataBase from "../core/Database.js";
import QUERY_GRAPHQL, { getPRGraphQLQuery, getPRsMeanTimeInfo } from "../core/QueriesGraphQL.js";
import { calculateLeadTime } from "./issuesController.js";
import { sendGitHubQuery } from '../utils/github-config.js';

export const getPullRequests = async () => {
    let prs;

    await sendGitHubQuery(QUERY_GRAPHQL.ALL_PR)
    .then(data => {
        prs = data.data.repository.pullRequests;
    })
    .catch(error => {
        console.error("Error:", error.message);
    });
    return prs;
}

export const getPullRequest = async (id) => {
    let pr;

    await sendGitHubQuery(getPRGraphQLQuery(id)).then(data => {
        pr = data.data.repository.pullRequest;
    }).catch(error => {
        console.error("Error:", error.message);
    });
    return pr;
}

export const getPullRequestLeadTime = async (req, res) => {
    let pr;
    let prLeadTime;
    pr = await getPullRequest(req.params.id).then((pr) => {
        if(pr == null){
            res.status(404).json(data);
            return;
        }else{
            var startDate = new Date(pr.createdAt);
            var endDate = new Date(pr.closedAt);
            var leadTime = calculateLeadTime(endDate - startDate);
            let leadTimeString = leadTime['days']+ " Days " + leadTime['hours'] + " hours " + leadTime['minutes'] +" minutes " +
            leadTime['seconds'] + " seconds.";
            prLeadTime = {'PullRequestID' : pr.number, 'Title' : pr.title, 'Timestamp' : new Date() , 'LeadTime' : leadTimeString}
        }
    }).catch(error => {
        console.error("Error:", error.message);
        res.status(400).json("ERROR");
    });
    return prLeadTime;
}

export const recordPullRequestLeadTime = async (prLeadTime) => {
    let conn = await dataBase.pool.getConnection();
    
    await conn.query(QUERY.CREATE_METRICS_PR, [prLeadTime['PullRequestID'], prLeadTime['Title'], prLeadTime['Timestamp'], prLeadTime['LeadTime']]);
    conn.end()
}

export const getPullRequestsSuccessfulPercentage = (req, res) => {
    sendGitHubQuery(QUERY_GRAPHQL.SUCCESSFULLY_MERGED_PR).then(data => {
        //console.log("Réponse de l'API de GitHub pour le lead time des issues: \n", JSON.stringify(data));
        console.log(data);
        const response = {};

        const successfulPullRequests = data.data.repository.successfulPullRequests.totalCount;
        const totalClosedPullRequests = data.data.repository.totalClosedPullRequests.totalCount;

        response.successfulPullRequests = successfulPullRequests;
        response.totalClosedPullRequests = totalClosedPullRequests;
        response.successfulPullRequestsPercentage = (successfulPullRequests / totalClosedPullRequests) * 100;

        res.json(response);

    }).catch(error => {
        console.error("Error:", error.message);
        res.status(400).json("ERROR");
    });
}

export const getPullRequestsOpenPercentage = (req, res) => {
    sendGitHubQuery(QUERY_GRAPHQL.CURRENTLY_OPENED_VS_TOTAL_PR).then(data => {
        //console.log("Réponse de l'API de GitHub pour le lead time des issues: \n", JSON.stringify(data));

        const response = {};

        const openPRs = data.data.repository.openPullRequests.totalCount;
        const totalPRs = data.data.repository.totalPullRequests.totalCount;

        response.openPullRequests = openPRs;
        response.totalPullRequests = totalPRs;
        response.openPullRequestsPercentage = (openPRs / totalPRs) * 100;

        res.json(response);

    }).catch(error => {
        console.error("Error:", error.message);
        res.status(400).json("ERROR");
    });
}

export const getPullRequestsByAuthor = (req, res) => {
    sendGitHubQuery(QUERY_GRAPHQL.AUTHORS_OF_PR).then(data => {
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
        res.json(response);
    })
    .catch(error => {
        console.error("Error:", error.message);
        res.status(400).json("ERROR");
    });
}

export const getPullRequestsMeanTime = (req, res) => {
    sendGitHubQuery(getPRsMeanTimeInfo(req.params.count)).then(data => {
        var pr = data.data.repository.pullRequests.edges;

        var sum = 0;
        let n = 0;
        pr.forEach((i) => {
            var duration = new Date(i.node.mergedAt) - new Date(i.node.createdAt);
            
            sum += duration;
            n++;
        });

        var mean = sum / n;

        //We obtain the mean separated into days, hours, minutes, seconds by reusing the function calculateLeadTime
        var meanJson = calculateLeadTime(mean);

        res.json(meanJson);
    })
    .catch(error => {
        console.error("Error:", error.message);
        res.status(400).json("ERROR");
    });
}

