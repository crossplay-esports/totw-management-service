import { getClient } from "../../../drivers/mongo";
import { AttributeConfigSchema, AttributeWeightageConfigSchema } from "../../config/attributeWeightConfig";

interface Nomination {
    id: String,
    name: String,
    gameWeek: Number,
    team: String,
    position: String,
    goals: String,
    assists : String,
    shot_accuracy : String,
    no_of_dribbles: String,
    dribble_accuracy: String,
    possession_lost: String,
    no_of_passes : String,
    pass_accuracy: String,
    no_of_tackles: String,
    tackle_accuracy: String,
    possession_won: String,
    clean_sheet: String
}

export async function listDatabases() {
    const client= await getClient();

    const databaseList = await client.db().admin().listDatabases();
    console.log('Databases: ');
    databaseList.databases.forEach(db => console.log(` - ${db.name}`))
    return databaseList;
}

export async function saveNomination(currentNominations : Nomination[]) {
    console.log(currentNominations);
    const client= getClient();
    const database = client.db('totw-db');
    const nomnination = database.collection<Nomination>("nomination");
    try{
        const result = await nomnination.insertMany(currentNominations);
        return {
            id: result.insertedIds
        }
    }
    catch(ex: any) {
        return {
            error : ex.message
        }
    }

}

export async function calculateTeamOfTheWeek(_gw: any) {
    
    const client= getClient();
    const database = client.db('totw-db');
    const nomination = database.collection<Nomination>("nomination");
    const attrbuteConfig = database.collection<AttributeConfigSchema>("attributeWeight");
    
    try{
        const attrbuteConfigArray = await attrbuteConfig.find().toArray();
        const attrbuteConf = attrbuteConfigArray[0];
       // write team of the week calculation logic
        const playerGroups = await nomination.aggregate([{
            $match: {gameWeek: 30}
        },
        {
            $group: {
                _id: "$position",
                playersByPosition: {
                    $push: "$$ROOT"
                }
            }
        }]).toArray();
        let allTopScoringPlayers : any = {}
        playerGroups.forEach(item => {
            const type: string = item._id;
            const players = item.playersByPosition;
            const currentTypeAttr: Array<AttributeWeightageConfigSchema> | any = attrbuteConf[type as keyof typeof attrbuteConf];
            currentTypeAttr.forEach((attr: any) => {
                const sortedByAttribute = players.sort((x: any, y: any) => y[attr.id] - x[attr.id]);
                //later handle for tied finish
                const [first,second,third, ..._restPlayers] = sortedByAttribute;
                allTopScoringPlayers[type] = allTopScoringPlayers[type].push(...[first,second,third]);
            });
        });
        let allAttributeScoredPlayers: any = {};
        Object.keys(allTopScoringPlayers).forEach((key:any) => {
            const currentTypePlayers = allTopScoringPlayers[key];
            
        })

        console.log(JSON.stringify(playerGroups));
        return playerGroups;
    }
    catch(ex: any) {
        console.log(ex)
        return {
            error : ex.message
        }
    }

}