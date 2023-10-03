import express from 'express';
import ExpressSession from 'express-session';
import { renderFile } from 'ejs';
import path from 'path';
import {fileURLToPath} from 'url';
import appRouter from './Back-end/routes/AppRouter.js';
import acceuilRouter from './Back-end/routes/acceuilRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var app = express();


app.set('views', __dirname + '/Front-end/views/');
app.engine('html', renderFile);
app.set('view engine', 'ejs');

app.use("/src/", express.static(__dirname));

app.use(express.json());
app.use(express.urlencoded());

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

var server = app.listen(5000, async function () {
    console.log("dataBase is loaded")
    routes();
    console.log('Node server is running...');
});