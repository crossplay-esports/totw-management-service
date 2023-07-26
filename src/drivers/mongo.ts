import {MongoClient} from 'mongodb';
require('dotenv').config();

let client : MongoClient;

const connect = async ()  => {
    client = new MongoClient(url);
    await client.connect();
}

require("dotenv").config();

const url = process.env.MONGO_DB_URL || 'mongodb://0.0.0.0:27017/';
console.log(process.env.url);
export function getClient() {
    return client;
}

export default connect;
