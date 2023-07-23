import dotenv from 'dotenv';
import server from './server';

dotenv.config();
const port = process.env.PORT || 8081;
server().listen(port);