import express from 'express';

class AcceuilRouter{
    constructor(){
        this.acceuilRouter = express.Router();
        this.init();
    }

    async pageAcceuil(req, res, next) {
         res.render('pageAcceuil.html');
    }

    init() {
        this.acceuilRouter.get('/log680/v1/pageAcceuil/', this.pageAcceuil.bind(this));
    }
}

const acceuilRouter = new AcceuilRouter();
acceuilRouter.init()
export default acceuilRouter;