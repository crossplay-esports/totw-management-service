import express from 'express';
import { getTop11FutwizPlayers } from '../database/mongo/dao/futwiz';

const router = express.Router();

router.get("/top11-players", async (req, res) => {
    const gw : any = req.query.gw?.toString();
    if(!gw) return res.status(400).send('gw is a required param');
    const result = await getTop11FutwizPlayers(parseInt(gw));
    if(result)
        return res.status(200).send(result);
    else {
        return res.status(500).send('No Players found');
    }
});

export default router;