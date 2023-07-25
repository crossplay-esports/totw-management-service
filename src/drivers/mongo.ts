import {MongoClient} from 'mongodb';

require("dotenv").config();

const url = process.env.MONGO_DB_URL || 'mongodb://0.0.0.0:27017/';
export async function connect() {
    console.log(url);
    const client = new MongoClient(url);
    await client.connect();
    return client;
}

export default connect;
