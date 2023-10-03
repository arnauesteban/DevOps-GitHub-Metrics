import express from 'express';

class AppRouter{
    constructor(){
        this.appRouter = express.Router();
        this.init();
    }

    init(){
        this.appRouter.get('/', this.goToIndex.bind(this));
    }

    goToIndex(req, res)
    {
        res.redirect('/log680/v1/pageAcceuil');
    }
}



const appRouter = new AppRouter();
appRouter.init()

export default appRouter;