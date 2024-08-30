const express = require('express');
const constants = require('../constants');
const appRoutes = require('../routes/index.js');
const { expressjwt } = require('express-jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require("../models/User.js")

module.exports = {
    connect(router) {
        router.use(cors());
        router.use(morgan('dev'));
        router.use(bodyParser.json());
        router.use(bodyParser.urlencoded({ extended: true }));

        router.use(
            expressjwt({
                secret: process.env.SECRET_KEY,
                algorithms: ['HS256']
            }).unless(constants.ALLOWED_ROUTES)
        );

        router.use(async (req, res, next) => {
            const authHeader = req.headers['authorization'];
            try {
                const token = authHeader?.split(' ')[1];

                if (token && !constants.ALLOWED_ROUTES[req.path]) {
                    const decoded = jwt.verify(token, process.env.SECRET_KEY, {
                        algorithms: ['HS256']
                    });

                    const { userId } = decoded;

                    const user = (await User.findById(userId, { _id: 1, email: 1, name: 1, categories: 1 }).lean());

                    if (!user) {
                        return res.status(constants.STATUS_CODES.NOT_FOUND).json({
                            success: false,
                            message: 'User Not Found',
                            data: ''
                        });
                    }

                    req.user = user;

                }

                return next();
            } catch (error) {
                return res.status(constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Internal Server Error.',
                    data: ''
                });
            }
        });

        router.use(express.urlencoded({ extended: true }));
        router.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

        router.use('/api', appRoutes);

        router.use((err, req, res, next) => {
            if (err.name === 'UnauthorizedError') {
                return res.status(constants.STATUS_CODES.UNAUTHORIZED).json({
                    success: false,
                    message: 'Unauthorized access.',
                    data: ''
                });
            }
            next();
        });
    }
};