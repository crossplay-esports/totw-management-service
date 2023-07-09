import {MongoClient} from 'mongodb';

const url = process.env.MONGO_DB_URL || 'mongodb://0.0.0.0:27017/';
console.log(process.env.url);
export async function connect() {
    console.log(url);
    const client = new MongoClient(url);
    await client.connect();
    return client;
}

export default connect;
