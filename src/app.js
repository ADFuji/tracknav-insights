import Fastify from 'fastify';
import mongodb from '@fastify/mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify({
    logger: true,
    level: 'info',
    prettyPrint: true
});

const uri = `${process.env.DB_TYPE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log(uri);

app.register(mongodb, {
    forceClose: true,
    url: uri
});

app.after(() => {
    app.decorate('mongoDB', app.mongo.db);
});

app.get('/', async (req, res) => {
    const ip = req.ip;
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