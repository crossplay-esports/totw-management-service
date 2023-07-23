import dotenv from 'dotenv';
import server from './server';

dotenv.config();
console.log('current env', process.env)

const port = process.env.PORT || 8081;
server().listen(port);