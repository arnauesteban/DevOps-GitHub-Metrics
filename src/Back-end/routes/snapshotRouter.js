import express from 'express';
import { getSnapshot, recordSnapshot } from '../controller/snapshotController.js';

const snapshotRouter = express.Router();

/**
 * @swagger
 * /snapshot:
 *  get:
 *      summary: snapshot of the project
 *      responses:
 *          200: 
 *              description: Snapshot of the project that portrays how many issues in each column
 *              content:
 *                  application/json:
 *                      items:
 *                          properties:
 *                              ProjectID:
 *                                  type: int
 *                                  description: ID of the project
 *                              Timestamp:
 *                                  type: date
 *                                  description: date and time of when the route was called
 *                              columns:
 *                                  application/json:
 *                                      items:
 *                                          properties:
 *                                              Backlog:
 *                                                  type: int
 *                                                  description: number of issues inside the backlog column
 *                                              A faire:
 *                                                  type: int
 *                                                  description: number of issues inside the a faire column
 *                                              En cours:
 *                                                  type: int
 *                                                  description: number of issues inside the en cours column
 *                                              Revue:
 *                                                  type: int
 *                                                  description: number of issues inside the revue column   
 *                                              complete:
 *                                                  type: int
 *                                                  description: number of issues inside the complete column                              
 */
snapshotRouter.get('/snapshot', async (req, res) => {
    let snapshot = await getSnapshot();
    await recordSnapshot(snapshot);
    res.json(snapshot);
});

snapshotRouter.route('/snapshot').post(recordSnapshot);

export default snapshotRouter;