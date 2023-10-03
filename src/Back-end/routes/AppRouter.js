import express from 'express';

class AppRouter{
    constructor(){
        this.appRouter = express.Router();
        this.init();
    }

    init(){
        //this.appRouter.get('/log680/v1', this.getRoutes.bind(this));
    }
}

const appRouter = new AppRouter();
appRouter.init()
export default appRouter;