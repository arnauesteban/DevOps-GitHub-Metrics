import express from 'express';
import { getSnapshot, recordSnapshot } from '../controller/snapshotController.js';

const snapshotRouter = express.Router();

snapshotRouter.get('/snapshot', async (req, res) => {
    let snapshot = await getSnapshot();
    await recordSnapshot(snapshot);
    res.json(snapshot);
});

snapshotRouter.route('/snapshot').post(recordSnapshot);

export default snapshotRouter;