import express from 'express';
import { sendGitHubQuery } from '../utils/github-config.js';

class KanbanMetricsRouterRouter{
    constructor(){
        this.kanbanMetricsRouter = express.Router();
        this.init();
    }

    async retrieveIssues(){
        let issues;
        let query = `
        query{
            repository(owner: "arnauesteban", name: "labo-devops-g14-a23") {
              projectV2(number: 2) {
                title
                items(first: 100) {
                  nodes {
                    content {
                      ... on Issue {
                        title
                        state
                      }
                    }
                    status: fieldValueByName(name: "Status") {
                      ... on ProjectV2ItemFieldSingleSelectValue {
                        column: name
                        updatedAt
                        createdAt
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
        console.log(count)
        return count;
    }


    init() {
        this.kanbanMetricsRouter.get('/log680/v1/issues/', this.retrieveIssues.bind(this));
        this.kanbanMetricsRouter.get('/log680/v1/nbIssues/:columnName', this.calculateNbIssuesPerColumn.bind(this));
    }
}

const kanbanMetricsRouter = new KanbanMetricsRouterRouter();
kanbanMetricsRouter.init()
export default kanbanMetricsRouter;