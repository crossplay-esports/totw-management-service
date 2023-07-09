import express from 'express';
import { listDatabases } from '../database/mongo/dao/manage-totw';

const router = express.Router();

router.use((_req, _res, next) => {
    console.log('Inside admin router: ', Date.now())
    next();
  });


router.get("/", async (_, res, _next) => {
    console.log('inside get')
    const dbs = await listDatabases();
    res.send(dbs.databases);
});

export default router;