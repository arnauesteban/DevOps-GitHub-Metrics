import express, { response } from 'express';
import ExpressSession from 'express-session';
import { renderFile } from 'ejs';
import path from 'path';
import {fileURLToPath} from 'url';
import appRouter from './Back-end/routes/AppRouter.js';
import acceuilRouter from './Back-end/routes/acceuilRouter.js';
import { sendGitHubQuery } from './Back-end/utils/github-config.js';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import kanbanMetricsRouter from './Back-end/routes/kanbanMetricsRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "GitHubMetrics API",
            version: "1.0.0",
            description: "An API to obtain Github metrics"
        },
        servers: [
            {
                url: "http://localhost:8080"
            }
        ],
    },
    apis: ["./Back-end/routes/*.js"]
}

var specs = swaggerJsDoc(options);
var app = express();


app.set('views', __dirname + '/Front-end/views/');
app.engine('html', renderFile);
app.set('view engine', 'ejs');

app.use("/src/", express.static(__dirname));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



function routes(){
    let router = express.Router();
    app.use(ExpressSession({
        secret: 'My Secret Key',
        resave: false,
        saveUninitialized: false
    }));

    app.use('/', router);
    app.use('/', appRouter.appRouter);
    app.use('/', acceuilRouter.acceuilRouter);
    app.use('/', kanbanMetricsRouter.kanbanMetricsRouter);
    app.use("/api-docs", swaggerUI.serve,swaggerUI.setup(specs));
}

var server = app.listen(8080, async function () {
    console.log("dataBase is loaded")
    routes();
    console.log('Node server is running...');

    //-----GitHub API test----
    var query = `
    query {
        repository(owner: "arnauesteban", name: "labo-devops-g14-a23") {
            issues(first: 4) {
                nodes {
                    title
                    closedAt
                }
            }
        }
    }
    `;
    sendGitHubQuery(query)
    .then(data => {
        //console.log("Réponse de l'API de GitHub:", JSON.stringify(data));
    })
    .catch(error => {
        console.error("Error:", error.message);
    });

    //----------------------
    
});