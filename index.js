const express = require('express');
const config = require('./src/config/index');
const { default: mongoose } = require('mongoose');

const StartServer = () => {
    app.listen(config.server.port, () =>
        console.info(`Server is running on port ${config.server.port}, NODE_ENV: ${config.env}`)
    );
};

mongoose.connect(config.mongo.url).then(() => {
    console.log('Connected to MongoDB');
    StartServer();
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const middleWare = require('./src/middleware');
const app = express();

middleWare.connect(app);
