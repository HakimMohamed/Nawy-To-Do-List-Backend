const mongoose = require('mongoose');

module.exports = async (uri) => {
    mongoose.set('strictQuery', true);

    await mongoose.connect(uri, {});

    mongoose.connection.once('open', () => console.log('MongoDB primary connection opened!'));
    mongoose.connection.on('connected', () => console.log('Primary Database Connected Successfully'));
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB primary connection failed, ' + err);
        mongoose.disconnect();
    });
    mongoose.connection.on('disconnected', () => console.log('MongoDB primary connection disconnected!'));

    // Graceful exit
    process.on('SIGINT', () => {
        mongoose.connection.close().then(() => {
            console.info('Mongoose primary connection disconnected through app termination!');
            process.exit(0);
        });
    });
};
