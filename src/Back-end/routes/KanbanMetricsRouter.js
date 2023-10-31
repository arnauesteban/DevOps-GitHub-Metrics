import express from 'express';
import { sendGitHubQuery } from '../utils/github-config.js';
import { github_data } from '../utils/github-config.js';

class KanbanMetricsRouterRouter{
    constructor(){
        this.kanbanMetricsRouter = express.Router();
        this.init();
    }

    /**
     * Cette fonction permet de récuperer une tâche créées dans le projet à partir du numéro de la tache
     * @param {*} req la requête de la route (permet d'obtenir les paramètres 
     * pour la récupération de donnée (numéro de tâche))
     * @param {*} res response de la route
     * @param {*} next 
     */
    async retrieveIssue(req, res, next){
      let issue;
      let query = `
      query {
        repository(owner: "${github_data.username}", name: "${github_data.repo}") {
            issue(number: ${req.params.number}) {
  						id
        			title
        			createdAt
        			closedAt
        			state
        			labels(first:10){
                nodes{
                  name
                }
              }
        			body
            }
        }
    }
      `;
      await sendGitHubQuery(query)
      .then(data => {
          issue= data.data.repository.issue;
          res.json(issue);
      })
      .catch(error => {
          console.error("Error:", error.message);
          console.log('lol2')
      });
      return issue;
  }

    /**
     * Cette fonction permet de récuperer une liste de toute les tâches créées dans le projet
     * @param {*} req la requête de la route 
     * @param {*} res response de la route
     * @param {*} next 
     */
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
            console.log('lol1')
        });
        return issues;
    }

    /**
     * Cette fonction permet d'obtenir le nombre de taches par colonnes
     * @param {*} req la requête de la route 
     * @param {*} res response de la route
     * @param {*} next 
     */
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

      let startedDateFilter = new Date(req.query.startDate);
      let endDateFilter = new Date(req.query.endDate);
      endDateFilter.setHours(endDateFilter.getHours()+23, 59, 59, 59);

      let issues;
      await this.retrieveIssues().then((response)=>{issues = response});

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
      return count;
    }


    init() {
        this.kanbanMetricsRouter.get('/issue/:number', this.retrieveIssue.bind(this))
        this.kanbanMetricsRouter.get('/issues', this.retrieveIssues.bind(this));
        this.kanbanMetricsRouter.get('/nbIssuesCol/:columnName', this.calculateNbIssuesPerColumn.bind(this));
        //this.kanbanMetricsRouter.post('/log680/v1/nbIssues/', this.calculateNbIssueCompletedInTimeframe.bind(this));
        this.kanbanMetricsRouter.get('/nbIssues', this.calculateNbIssueCompletedInTimeframe.bind(this));
    }
}

const kanbanMetricsRouter = new KanbanMetricsRouterRouter();
kanbanMetricsRouter.init()
export default kanbanMetricsRouter;