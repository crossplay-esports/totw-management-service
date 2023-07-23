import express from 'express';
import {memberSearch} from '../database/discord/dao/guild';


const router = express.Router();

router.use((_req, _res, next) => {
    console.log('Inside discord router: ', Date.now())
    next();
  });


router.get("/member/search", async (req, res, _next) => {
    const {query} = req;
    const {gt} = query;
    if(!gt){
        res.status(400).send('Send gt as a mandatory query parameter')
    };
    const users = await memberSearch(gt);
    res.send(users);
});

export default router;