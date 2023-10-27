import express from 'express';
import { getSnapshot, recordSnapshot } from '../controller/snapshotController.js';

const snapshotRouter = express.Router();

snapshotRouter.route('/snapshot').get(getSnapshot);

snapshotRouter.route('/snapshot').post(recordSnapshot);

export default snapshotRouter;