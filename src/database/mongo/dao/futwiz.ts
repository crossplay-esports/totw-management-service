import { getClient } from "../../../drivers/mongo";
import { getTotw } from "./manage-totw";

//TODO: Make this configurable later
const top11Players = [
	"ronaldo",
	"pele",
	"messi",
	"kevin de bruyne",
	"bellingham",
	"zidane",
	"ashley cole",
	"maldini",
	"virgil",
	"hakimi",
	"yashin",
];
const playerSearchBaseAPIURL = "https://www.futwiz.com/en/searches/player22/";

// This method will be called on server startup
// TODO: later schedule this to refresh players everyweek
export async function initializePlayerData() {
	//if there are already 10 players dont do anything
	const client = getClient();
	const database = client.db("totw-db");
	const futwizPlayers = database.collection("futwiz-players");
	const playerCount = await futwizPlayers.countDocuments();
	if (playerCount == 0) {
		// if there are no players then call futwiz search apis with 10 random player names,
		// and then save them in data base.
		// currently there is no better way to get 10 players from futwiz.
		// TODO: Change this to get all 11 players at once
		top11Players.forEach(async (item) => {
			const response = await fetch(`${playerSearchBaseAPIURL}${item}`);
			const players = await response.json();
			if (players && players.length > 0)
				await futwizPlayers.insertOne(players[0]);
		});
	}
	const players = await futwizPlayers.find();
	return players;
}

export async function getTop11FutwizPlayers(gw: number) {
	const client = getClient();
	const database = await client.db("totw-db");
	const futwiz = database.collection("futwiz-players");
	const players = await futwiz.find().toArray();
	const totwWinners = await getTotw(gw);
	if (!totwWinners) return players;

	const totwWinnersMap: Record<string, any> = {};

	const { winners=[] } = totwWinners;
	console.log(totwWinnersMap);
	winners.forEach((cat: any) => {
		const { pos, players=[] } = cat;
		if(pos) {
			totwWinnersMap[pos] = players;
		}
	})

	const mergedPlayers = players.map((item: any) => {
		if (["cf", "st", "lf", "rf", "lw", "rw"].indexOf(item.position.toLowerCase()) !== -1) {
			const attackers = totwWinnersMap.attackers;
			const attacker = attackers.splice(0,1)[0];
			totwWinnersMap.attackers = attackers;
			return {
				...item,
				name: attacker?.id || item.name,
				score: attacker?.score || undefined
			};
		}
		else if (["lm", "rm", "cam", "cdm", "cm"].indexOf(item.position.toLowerCase()) !== -1) {
			const mids = totwWinnersMap.mid || [];
			const mid = mids.splice(0,1)[0];
			totwWinnersMap.mid = mids;
			return {
				...item,
				name: mid?.id || item.name,
				score: mid?.score || undefined
			};
		}
		else if (["lb", "lwb","rb", "rwb", "cb"].indexOf(item.position.toLowerCase()) !== -1) {
			const defenders = totwWinnersMap.defenders;
			const def = defenders.splice(0,1)[0]; 
			totwWinnersMap.defenders = defenders;
			return {
				...item,
				name: def?.id || item.name,
				score: def?.score || undefined
			};
		}
		else return item;
	});
	console.log(mergedPlayers);
	return mergedPlayers;
}
