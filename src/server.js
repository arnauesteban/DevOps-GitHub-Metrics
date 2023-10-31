import express, { response } from 'express';
import ExpressSession from 'express-session';
import issuesRouter from './Back-end/routes/issuesRouter.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './Back-end/utils/swaggerConfig.js'
import snapshotRouter from './Back-end/routes/snapshotRouter.js';
import pullRequestRouter from './Back-end/routes/pullRequestRouter.js';


var app = express();

// Route pour la documentation générée par Swagger.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
    app.use('/', issuesRouter);
    app.use('/', snapshotRouter);
    app.use('/', pullRequestRouter);
}

var server = app.listen(8080, async function () {
    console.log("dataBase is loaded")
    routes();
    console.log('Node server is running...');
});