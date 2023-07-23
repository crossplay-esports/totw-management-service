import connect from "../../../drivers/mongo";

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
    "yashin"
];
const playerSearchBaseAPIURL = "https://www.futwiz.com/en/searches/player22/";

// This method will be called on server startup
// TODO: later schedule this to refresh players everyweek
export async function initializePlayerData() {
	//if there are already 10 players dont do anything
	const client = await connect();
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
			if (players && players.length > 0) await futwizPlayers.insertOne(players[0]);
		});
	}
	const players = await futwizPlayers.find();
	return players;
}

export async function getTop11FutwizPlayers() {
    const client = await connect();
    const database = await client.db('totw-db');
    const futwiz = database.collection("futwiz-players");
    const players = futwiz.find().toArray();
    return players;
}
