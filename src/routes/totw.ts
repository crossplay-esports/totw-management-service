import express from 'express';
import { saveNomination } from '../database/mongo/dao/manage-totw';

const router = express.Router();

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

export default router;