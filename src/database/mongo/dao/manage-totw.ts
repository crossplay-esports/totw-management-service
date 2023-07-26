import { getClient } from "../../../drivers/mongo";

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