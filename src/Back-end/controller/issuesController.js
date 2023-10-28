import dataBase from "../core/Database.js";
import QUERY_DB from "../core/QueriesDB.js";
import QUERY_GRAPHQL from "../core/QueriesGraphQL.js"
import { getIssueGraphQLQuery } from "../core/QueriesGraphQL.js";
import { sendGitHubQuery } from '../utils/github-config.js';

export const getIssues = async () => {
    let issues;

    await sendGitHubQuery(QUERY_GRAPHQL.ALL_ISSUES)
    .then(data => {
        issues = data.data.repository.projectV2.items.nodes;
    })
    .catch(error => {
        console.error("Error:", error.message);
    });
    return issues;
}

export const getIssue = async (id) => {
    let issue;

    await sendGitHubQuery(getIssueGraphQLQuery(id)).then(data => {
        issue = data.data.repository.issue;
    }).catch(error => {
        console.error("Error:", error.message);
    });
    return issue;
}

export const getNbIssuesPerColumn = async (req, res) => {
    let count = 0
    let columnName = req.params.column_name.replace(/[\u0300-\u036f]/g, '').toLowerCase().replaceAll("_"," ").replaceAll("\"", "");
    let issues;
    await getIssues().then((response)=>{issues = response});
    
    for(let i = 0; i< issues.length; i++){
        let issue = issues[i];
        for(let key in issue){
            let column = "";
            if(issue[key].column !== undefined){
                column = JSON.stringify(issue[key].column).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replaceAll("_"," ").replaceAll("\"", "");
            }
            if(column == columnName){
                count++;
            }
        }
    }
    res.json({columnName : columnName, issuesNumber : count});
}

export const getNbIssueCompletedInTimeframe = async (req, res) =>{
    let count = 0

    let startedDateFilter = new Date(req.params.startDate);
    let endDateFilter = new Date(req.params.endDate);
    endDateFilter.setHours(endDateFilter.getHours()+23, 59, 59, 59);

    let issues;
    await getIssues().then((response)=>{issues = response});
    
    for(let i = 0; i< issues.length; i++){
      let issue = issues[i];
      let startedAt = new Date(issue.content.createdAt);
      let closedAt;
      if(issue.content.closedAt !==null || undefined){
        closedAt = new Date(issue.content.closedAt);
      }   
      if(startedDateFilter <= startedAt && endDateFilter >= closedAt){
        count++;
      }
    }
    res.json({fromDate : startedDateFilter, untilDate : endDateFilter, issuesNumber : count});
}

export const getLeadTimeIssue = async (req, res) =>{
    const issueId = req.params.id; // Get the value of the parameter of the GET request
    let createdAt;
    let closedAt;
    let leadTimeIssue;
    let issue;

    await getIssue(issueId).then((response)=>{
        issue = response;
    });
    
    if(issue == null){
        res.status(404).json(data);
        return;
    }
    
    //Checks if the issue is closed
    if(issue.closedAt == null){
        res.status(405).json(data);
        return;
    }
    createdAt = new Date(issue.createdAt);
    closedAt = new Date(issue.closedAt);
    leadTimeIssue = calculateLeadTime(closedAt - createdAt);
    res.json(leadTimeIssue);
}

export const recordLeadTimeIssue = (req, res) =>{

}

export const getLeadTimeIssuesByPeriod = async (req, res) =>{
    // Gets the start and end dates
    let startDate = new Date(req.params.startDate);
    let endDate = new Date(req.params.endDate);
    endDate.setHours(endDate.getHours()+23, 59, 59, 59); //Correction to the time to ensure a good performance
    let issuesWithinRange;
    
    if(req.query.startDate == "" || req.query.endDate == ""){
        res.status(400).json("ERROR");
        return;
    }
        
    //Gets the issues in ascending order based on its closing date
    await sendGitHubQuery(QUERY_GRAPHQL.CLOSED_ISSUES).then(data => {
        // Filters the issues closed within the start and end dates
        issuesWithinRange = data.data.repository.issues.nodes.filter((issue) => {
                const closedDate = new Date(issue.closedAt);
                return closedDate.getTime() >= startDate.getTime() && closedDate.getTime() <= endDate.getTime();
        });
    }).catch(error => {
        console.error("Error:", error.message);
        res.status(400).json("ERROR");
    });
    
    //Calculates the lead time
    //Creates the list of issues with its lead time
    const issues = []
    issuesWithinRange.forEach((i) => {
        const leadTimeObject = calculateLeadTime(new Date(i.closedAt) - new Date(i.createdAt));
        issues.push({
            number : i.number,
            title : i.title,
            leadTime : leadTimeObject
        });
    });
    res.json(issues);
};

export function calculateLeadTime(leadTimeInMilliseconds) {
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

