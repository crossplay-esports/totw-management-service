import express from "express";
import { memberSearch, teamSearch } from "../database/discord/dao/guild";

const router = express.Router();

router.use((_req, _res, next) => {
	console.log("Inside discord router: ", Date.now());
	next();
});

router.get("/member/search", async (req, res, _next) => {
	try {
		const { query } = req;
		const { gt, limit } = query;
		if (!gt) {
			res.status(400).send("Send gt as a mandatory query parameter");
			return;
		}
		const users = await memberSearch(gt, limit);
		res.send(users);
	} catch (e: any) {
		res.status(500);
		res.json({ err: e.message });
	}
});

router.get("/team/search", async (req, res, _next) => {
	try {
		const { query } = req;
		const { team, limit } = query;
		if (!team) {
			res.status(400).send("Send team as a mandatory query parameter");
			return;
		}
		console.log(limit);
		const teams = await teamSearch();
		const leagueTeams = teams.filter((t:any) => t.name.toLowerCase().indexOf('team - ') !== -1 && t.name.toLowerCase().indexOf(team.toString().toLowerCase()) !== -1);
		console.log(leagueTeams);
		res.send(leagueTeams);
	} catch (e: any) {
		res.status(500);
		res.json({ err: e.message });
	}
});

export default router;
