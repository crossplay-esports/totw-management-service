import { getClient } from "../../drivers/mongo";

export interface AttributeConfigSchema {
	attackers: Array<AttributeWeightageConfigSchema>,
	mid:  Array<AttributeWeightageConfigSchema>,
	defenders :  Array<AttributeWeightageConfigSchema>
}

export interface AttributeWeightageConfigSchema {
	id : string,
	name: string,
	weightage: number,
	type: string,
	hint: string
}



const seedData: AttributeConfigSchema = {
	attackers: [
		{
			id: "goals",
			name: "Goals",
			weightage: 30,
			type: "positive",
			hint: "Most Impactful attacking attribute",
		},
		{
			id: "assists",
			name: "Assists",
			weightage: 30,
			type: "positive",
			hint: "Most Impactful attacking attribute",
		},
		{
			id: "shot_accuracy",
			name: "Shot Accuracy(%)",
			weightage: 10,
			type: "positive",
			hint: "Somewhat Impactful attacking attribute",
		},
		{
			id: "no_of_dribbles",
			name: "No of Dribbles",
			type: "positive",
			weightage: 10,
			hint: "Somewhat Impactful attacking attribute",
		},
		{
			id: "dribble_accuracy",
			name: "Dribble Accuracy(%)",
			type: "positive",
			weightage: 10,
			hint: "Somewhat Impactful attacking attribute",
		},
		{
			id: "possession_lost",
			name: "Possession Lost",
			type: "negetive",
			weightage: 10,
			hint: "Negetively Impactful attacking attribute",
		},
	],
	mid: [
		{
			id: "goals",
			name: "Goals",
			weightage: 20,
			type: "positive",
			hint: "Most Impactful midfielder attribute",
		},
		{
			id: "assists",
			name: "Assists",
			weightage: 20,
			type: "positive",
			hint: "Most Impactful midfielder attribute",
		},
		{
			id: "no_of_passes",
			name: "No of passes",
			weightage: 10,
			type: "positive",
			hint: "Somewhat Impactful midfielder attribute",
		},
		{
			id: "pass_accuracy",
			name: "Pass Accuracy(%)",
			weightage: 10,
			type: "positive",
			hint: "Somewhat Impactful midfielder attribute",
		},
		{
			id: "no_of_dribbles",
			name: "No of Dribbles",
			type: "positive",
			weightage: 5,
			hint: "Low Impact midfielder attribute",
		},
		{
			id: "dribble_accuracy",
			name: "Dribble Accuracy(%)",
			type: "positive",
			weightage: 5,
			hint: "Low Impact midfielder attribute",
		},
		{
			id: "no_of_tackles",
			name: "No of Tackles",
			type: "positive",
			weightage: 5,
			hint: "Low Impact midfielder attribute",
		},
		{
			id: "tackle_accuracy",
			name: "Tackle Accuracy(%)",
			type: "positive",
			weightage: 5,
			hint: "Low Impact midfielder attribute",
		},
		{
			id: "possession_won",
			name: "Possession Won",
			type: "positive",
			weightage: 10,
			hint: "Somewhat Impactful midfielder attribute",
		},
		{
			id: "possession_lost",
			name: "Possession Lost",
			type: "negetive",
			weightage: 10,
			hint: "Negetively Impactful midfielder attribute",
		},
	],
	defenders: [
		{
			id: "no_of_tackles",
			name: "No of tackles",
			weightage: 15,
			type: "positive",
			hint: "Somewhat Impactful defending attribute",
		},
		{
			id: "tackle_accuracy",
			name: "Tackle Accuracy(%)",
			weightage: 15,
			type: "positive",
			hint: "Somewhat Impactful defending attribute",
		},
		{
			id: "possession_won",
			name: "Possession Won",
			weightage: 15,
			type: "positive",
			hint: "Somewhat Impactful defending attribute",
		},
		{
			id: "possession_lost",
			name: "Possession Lost",
			weightage: 15,
			type: "negetive",
			hint: "Somewhat Impactful defending attribute",
		},
		{
			id: "clean_sheet",
			name: "Clean Sheet",
			weightage: 40,
			type: "positive",
			hint: "Most Impactful defending attribute",
		},
	],
};

export async function seedAttributeWeight() {
	const client = getClient();
	const database = client.db("totw-db");
	const attrCollection = database.collection<AttributeConfigSchema>(
		"attributeWeight"
	);
	try {
		const currentData = await attrCollection.find().toArray();
		if (currentData && (await currentData).length > 0) {
			return currentData;
		} else {
			// create from seed data
			await attrCollection.insertOne(seedData);
			const newData = await attrCollection.find().toArray();
			return newData;
		}
	} catch (error: any) {
		return {
			error: error.message,
		};
	}
}
