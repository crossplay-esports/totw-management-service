import express, {Request, Response} from 'express';
import http from 'http';
import cors from 'cors';
import adminRoute from './routes/admin';
import totwRoute from './routes/totw';

const app = () => {
    const app = express();
    app.use((_: Request, res: Response, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Credentials, Set-Cookie',
        );
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header(
          'Access-Control-Allow-Headers',
          'Content-Type, Accept, Access-Control-Allow-Credentials, Cross-Origin',
        );
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        next();
    });
    app.use(cors());
    app.use(express.json());
    app.get('/health', (_, res) => res.status(200).send({ success: true }));
    app.use('/admin',adminRoute);
    app.use('/totw',totwRoute)
     // All non-specified routes return 404
    app.get('*', (_, res) => res.status(404).send('Not Found'));

    const server = http.createServer(app);
    server.on('listening', () => {
        console.info(`TOTW service listening on port ${process.env.PORT}...`);
    });
    return server;
}

export default app;