import express from 'express';
import { sendGitHubQuery } from '../utils/github-config.js';
import { github_data } from '../utils/github-config.js';

class KanbanMetricsRouterRouter{
    constructor(){
        this.kanbanMetricsRouter = express.Router();
        this.init();
    }

    async retrieveIssues(req, res, next){
        let issues;
        let query = `
        query{
            repository(owner: "${github_data.username}", name: "${github_data.repo}") {
              projectV2(number: 2) {
                title
                items(first: 100) {
                  nodes {
                    content {
                      ... on Issue {
                        title
                        state
                        createdAt
                        closedAt
                      }
                    }
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
        await sendGitHubQuery(query)
        .then(data => {
            issues= data.data.repository.projectV2.items.nodes;
            res.json(issues);
        })
        .catch(error => {
            console.error("Error:", error.message);
        });
        return issues;
    }

    async calculateNbIssuesPerColumn(req, res, next){
        let count = 0
        let columnName = req.params.columnName.replace(/[\u0300-\u036f]/g, '').toLowerCase().replaceAll("_"," ").replaceAll("\"", "");
        
        let issues;
        await this.retrieveIssues().then((response)=>{issues = response});
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

    async calculateNbIssueCompletedInTimeframe(req, res, next){
      let count = 0

      let startedDateFilter = new Date(req.params.startDate);
      let endDateFilter = new Date(req.params.endDate);
      endDateFilter.setHours(endDateFilter.getHours()+23, 59, 59, 59);

      let issues;
      await this.retrieveIssues().then((response)=>{issues = response});

      for(let i = 0; i< issues.length; i++){
        let issue = issues[i];
        console.log(issue);
        let startedAt = new Date(issue.content.createdAt);
        let closedAt;
        if(issue.content.closedAt !==null || undefined){
          closedAt = new Date(issue.content.closedAt);
        }
        console.log(startedDateFilter + " vs " +startedAt);
        console.log(endDateFilter +" vs "+  closedAt)    
        if(startedDateFilter <= startedAt && endDateFilter >= closedAt){
          console.log(startedDateFilter + " vs " +startedAt);
          console.log(endDateFilter +" vs "+  closedAt)    
          count++;
        }
      }
      res.json({fromDate : startedDateFilter, untilDate : endDateFilter, issuesNumber : count});
      return count;
    }


    init() {
        this.kanbanMetricsRouter.get('/issues', this.retrieveIssues.bind(this));
        this.kanbanMetricsRouter.get('/nbIssuesCol/:columnName', this.calculateNbIssuesPerColumn.bind(this));
        //this.kanbanMetricsRouter.post('/log680/v1/nbIssues/', this.calculateNbIssueCompletedInTimeframe.bind(this));
        this.kanbanMetricsRouter.get('/nbIssues/:startDate/:endDate', this.calculateNbIssueCompletedInTimeframe.bind(this));
    }
}

const kanbanMetricsRouter = new KanbanMetricsRouterRouter();
kanbanMetricsRouter.init()
export default kanbanMetricsRouter;