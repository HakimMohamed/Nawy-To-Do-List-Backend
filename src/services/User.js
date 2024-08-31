const mongoose = require('mongoose')
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
class UserService {
    async getUserByEmail(email) {
        return User.findOne({ email }).lean();
    }

    async register(email, password, name) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: email,
            password: hashedPassword,
            name
        });

        const savedUser = await newUser.save();

        const token = this.generateUserToken(savedUser.email, savedUser._id.toString());

        return Promise.resolve(token);
    }

    generateUserToken(email, userId) {
        return jwt.sign({ email, userId }, process.env.SECRET_KEY, { expiresIn: '7d', algorithm: 'HS256' });
    }
}

module.exports = new UserService()
