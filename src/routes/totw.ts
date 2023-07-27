import express from 'express';
import { calculateTeamOfTheWeek, saveNomination } from '../database/mongo/dao/manage-totw';

const router = express.Router();


router.use((_req, _res, next) => {
	console.log("Inside totw router: ", Date.now());
	next();
});

router.post("/saveNominations", async (req, res) => {
    console.log(req.body);
    const nominations = req.body.nominations;
    const result = await saveNomination(nominations);
    if(result.id)
        res.status(201).send(`Nomination players saved ${result.id}` )
    else {
        res.send(500).send(result.error);
    }
});

router.post("/calculate-totw", async (req, res) => {
    const {gw} = req.query;
    const result = await calculateTeamOfTheWeek(gw);
    if(result)
        res.status(201).send(`TOTW submitted` )
    else {
        res.send(500).send("Exception occured during totw calculation");
    }
});

export default router;