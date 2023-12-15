import Fastify from 'fastify';
import mongodb from '@fastify/mongodb';
import dotenv from 'dotenv';
import fastifyCors from '@fastify/cors';
dotenv.config();

const app = Fastify({
    logger: true,
    level: 'info',
    prettyPrint: true
});

// Enable CORS
app.register(fastifyCors, {
    origin: '*'
});

const uri = `${process.env.DB_TYPE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log(uri);

app.register(mongodb, {
    forceClose: true,
    url: uri,
    auth: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS
    }
}, err => {
    if (err) throw err;

    app.log.info('MongoDB connected...');
    app.decorate('mongo', app.mongo.db);
});

app.get('/', async (req, res) => {
    // récupérer l'arg clientIp de l'url
    const clientIp = req.query.clientIp;
    console.log(clientIp);
    const ip = clientIp;
    const date = new Date();
    const data = {
        ip,
        date
    };
    const collection = app.mongo.db.collection('visitors');
    const result = await collection.insertOne(data);
    return result;
});

const start = async () => {
    try {
        await app.listen({
            port: process.env.PORT || 3000,
            host: '0.0.0.0'
        });
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
};

start();