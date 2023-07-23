import express from 'express';
import { getTop11FutwizPlayers } from '../database/mongo/dao/futwiz';

const router = express.Router();

router.get("/top11-players", async (_req, res) => {
    const result = await getTop11FutwizPlayers();
    if(result)
        res.status(200).send(result);
    else {
        res.status(500).send('No Players found');
    }
});

export default router;