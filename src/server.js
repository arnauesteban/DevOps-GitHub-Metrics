import express, { response } from 'express';
import ExpressSession from 'express-session';
import { renderFile } from 'ejs';
import path from 'path';
import {fileURLToPath} from 'url';
import appRouter from './Back-end/routes/AppRouter.js';
import acceuilRouter from './Back-end/routes/acceuilRouter.js';
import { sendGitHubQuery } from './Back-end/utils/github-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

    router.get('/', (req, res, next) => {
        res.redirect('/log680/v1/pageAcceuil');
    });

    app.use('/', router);
    app.use('/', appRouter.appRouter);
    app.use('/', acceuilRouter.acceuilRouter);

    
}

var server = app.listen(8080, async function () {
    console.log("dataBase is loaded")
    routes();
    console.log('Node server is running...');


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
        console.log("Réponse de l'API de GitHub:", JSON.stringify(data));
    })
    .catch(error => {
        console.error("Error:", error.message);
    });
    
});

//token: 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