const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const env = process.env.NODE_ENV;
const config = {
    env,
    mongo: {
        url: MONGO_URI
    },
    server: {
        port: SERVER_PORT
    }
};

module.exports = config