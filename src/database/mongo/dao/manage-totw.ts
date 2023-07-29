import { getClient } from "../../../drivers/mongo";
import {
	AttributeConfigSchema,
	AttributeWeightageConfigSchema,
} from "../../config/attributeWeightConfig";
import { maxPlayersForPosition } from "../../config/maxPlayersForPosition";

interface Nomination {
	id: String;
	name: String;
	gameWeek: Number;
	team: String;
	position: String;
	goals: String;
	assists: String;
	shot_accuracy: String;
	no_of_dribbles: String;
	dribble_accuracy: String;
	possession_lost: String;
	no_of_passes: String;
	pass_accuracy: String;
	no_of_tackles: String;
	tackle_accuracy: String;
	possession_won: String;
	clean_sheet: String;
}

export async function listDatabases() {
	const client = await getClient();

	const databaseList = await client.db().admin().listDatabases();
	console.log("Databases: ");
	databaseList.databases.forEach((db) => console.log(` - ${db.name}`));
	return databaseList;
}

export async function getTotw(gw:number) {
	const client = await getClient();
	const totwCollection = await client.db('totw-db').collection('currentTeamOfTheWeek');
	const gameWeekTotw = await totwCollection.findOne({gameWeek: gw});
	return gameWeekTotw;
}

export async function saveNomination(currentNominations: Nomination[]) {
	console.log(currentNominations);
	const client = getClient();
	const database = client.db("totw-db");
	const nomnination = database.collection<Nomination>("nomination");
	try {
		const result = await nomnination.insertMany(currentNominations);
		return {
			id: result.insertedIds,
		};
	} catch (ex: any) {
		return {
			error: ex.message,
		};
	}
}

export async function calculateTeamOfTheWeek(gw: any) {
	const client = getClient();
	const database = client.db("totw-db");
	const nomination = database.collection<Nomination>("nomination");
	const attrbuteConfig = database.collection<AttributeConfigSchema>(
		"attributeWeight"
	);
	const currentTeamOfTheWeek = database.collection(
		"currentTeamOfTheWeek"
	);

	try {
		const attrbuteConfigArray = await attrbuteConfig.find().toArray();
		const attrbuteConf: AttributeConfigSchema = attrbuteConfigArray[0];
		// write team of the week calculation logic
		const playerGroups = await nomination
			.aggregate([
				{
					$match: { gameWeek: parseInt(gw) },
				},
				{
					$group: {
						_id: "$position",
						playersByPosition: {
							$push: "$$ROOT",
						},
					},
				},
			])
			.toArray();
		let allTopScoringPlayers: any = {};
		console.log(playerGroups);
		playerGroups.forEach((item) => {
			const type: string = item._id;
			const players = item.playersByPosition;
			const currentTypeAttr: Array<AttributeWeightageConfigSchema> | any =
				attrbuteConf[type as keyof typeof attrbuteConf];
			currentTypeAttr.forEach((attr: any) => {
				const sortedByAttribute = players.sort(
					(x: any, y: any) => y[attr.id] - x[attr.id]
				);
				//later handle for tied finish
				const [first, second, third, ..._restPlayers] = sortedByAttribute;
				allTopScoringPlayers[type] = allTopScoringPlayers[type] || [];
				allTopScoringPlayers[type].push(
					...[
						{ id: first.name, attr: attr.id, attrType: attr.type, meta: first },
						{
							id: second.name,
							attr: attr.id,
							attrType: attr.type,
							meta: second,
						},
						{ id: third.name, attr: attr.id, attrType: attr.type, meta: third },
					]
				);
			});
		});
		let allAttributeScoredPlayers: any = {};
		Object.keys(allTopScoringPlayers).forEach((key: any) => {
			const currentTypePlayers = allTopScoringPlayers[key];
			currentTypePlayers.forEach((playerAttrMap: any) => {
				allAttributeScoredPlayers[key] = allAttributeScoredPlayers[key] || [];
				if (allAttributeScoredPlayers[key].filter((x:any) => x.playerId == playerAttrMap.id)?.length > 0) {
					const currentAttributes: AttributeWeightageConfigSchema[] =
						attrbuteConf[key as keyof typeof attrbuteConf];
                        const current: AttributeWeightageConfigSchema =
						currentAttributes.filter(x => x.id ==playerAttrMap.attr)[0];
					const updatedScoreForPlayer = allAttributeScoredPlayers[key].filter((x:any) => x.playerId == playerAttrMap.id)[0].score += current.type == "positive" ?current.weightage : -1 * current.weightage;
					(allAttributeScoredPlayers[key].find((pr:any) => pr.playerId === playerAttrMap.id)).score = updatedScoreForPlayer;
				} else {
					const currentAttributes: AttributeWeightageConfigSchema[] =
						attrbuteConf[key as keyof typeof attrbuteConf];
					const current: AttributeWeightageConfigSchema =
						currentAttributes.filter(x => x.id ==playerAttrMap.attr)[0];
					allAttributeScoredPlayers[key].push({
                        playerId : playerAttrMap.id,
                        score: current.type == "positive" ?current.weightage : -1 * current.weightage
                    })
				}
			});
		});

		console.log(JSON.stringify(allAttributeScoredPlayers));
        let top11Players:any = [];
        Object.keys(allAttributeScoredPlayers).forEach(key => {
            const topPlayersInEachPosition = allAttributeScoredPlayers[key].sort((x: any, y:any) => y.score - x.score).slice(0,maxPlayersForPosition[key as keyof typeof maxPlayersForPosition]);
            const topPlayerWithPlayerDetails = topPlayersInEachPosition.map((player:any) => {
                return {
                    id: player.playerId,
                    score: player.score,
                    meta : playerGroups.filter((x:any) => x._id == key)[0].playersByPosition.filter((y:any) => y.id == player.playerId)[0]
                }
            });
            top11Players.push({
                pos: key,
                players : topPlayerWithPlayerDetails
            })
        });
		await currentTeamOfTheWeek.updateOne({"gameWeek": parseInt(gw)},{$set: { winners: top11Players, gameWeek: parseInt(gw)}}, {upsert: true});
		return top11Players;
	} catch (ex: any) {
		console.log(ex);
		return ex;
	}
}
