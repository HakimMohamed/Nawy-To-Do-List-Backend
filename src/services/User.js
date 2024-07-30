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

        const token = jwt.sign({ email, userId: savedUser._id }, process.env.SECRET_KEY, {
            expiresIn: '365d',
            algorithm: 'HS256'
        });

        return Promise.resolve(token);
    }
}

module.exports = new UserService()
