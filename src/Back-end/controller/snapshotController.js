import QUERY from "../core/QueriesDB.js";
import dataBase from "../core/Database.js";
import QUERY_GRAPHQL from "../core/QueriesGraphQL.js";
import { sendGitHubQuery } from '../utils/github-config.js';

export const getSnapshot = (req, res ) => {
    sendGitHubQuery(QUERY_GRAPHQL.SNAPSHOT)
    .then(data => {
        //console.log("Réponse de l'API de GitHub pour le lead time d'une issue ", JSON.stringify(data));

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

export const recordSnapshot = (req, res) => {

}