import QUERY from "../core/QueriesDB.js";
import dataBase from "../core/Database.js";
import QUERY_GRAPHQL from "../core/QueriesGraphQL.js";
import { sendGitHubQuery } from '../utils/github-config.js';

export const getSnapshot = async () => {
    let snapshot;
    await sendGitHubQuery(QUERY_GRAPHQL.SNAPSHOT)
    .then(data => {
        snapshot = {'ProjectID':"" , 'Timestamp' : new Date(), 
                            columns:{
                                'Backlog' : 0, 'A faire' : 0, 'En cours' : 0, 'Revue' : 0, 'Complété' : 0
                            }
                        };
        snapshot.ProjectID = data.data.repository.projectV2.number;
        data.data.repository.projectV2.items.nodes.forEach((c) => {
            var columnName = c.status.column;
            if(snapshot.columns[columnName]){
                snapshot.columns[columnName]++;
            }else{
                snapshot.columns[columnName] = 1;
            }
        });
    })
    .catch(error => {
        console.error("Error:", error.message);
        res.status(400).json("ERROR");
    });
    return snapshot;
}

export const recordSnapshot = async (snapshot) => {
    let conn = await dataBase.pool.getConnection();
    await conn.query(QUERY.CREATE_METRICS_SNAPSHOT, [snapshot.ProjectID, snapshot.Timestamp, snapshot.columns['Backlog'], 
                        snapshot.columns['A faire'], snapshot.columns['En cours'], snapshot.columns['Revue'], snapshot.columns['Complété']]);
    conn.end()
}