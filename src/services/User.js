const mongoose = require('mongoose')
const User = require("../models/User")
const UserOtp = require("../models/UserOtp")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SERVICE,
        pass: process.env.GMAIL_KEY
    }
});

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

        const savedUser = newUser.save();

        return Promise.resolve(savedUser);
    }

    async generateUserToken(email, userId) {
        return jwt.sign({ email, userId }, process.env.SECRET_KEY, { expiresIn: '60d', algorithm: 'HS256' });
    }

    generateOTP() {
        return crypto.randomInt(1000, 10000);
    }

    async hashOTP(otp) {
        const saltRounds = 10;
        return bcrypt.hash(otp.toString(), saltRounds);
    }

    async sendOTP(email, otp) {
        const mailOptions = {
            from: process.env.GMAIL_KEY,
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is: ${otp}`
        };

        const now = new Date();
        const tenMinutesAgo = new Date(now - 10 * 60 * 1000);

        const otpDoc = await UserOtp.findOne({
            email,
            createdAt: { $gte: tenMinutesAgo },
            otpEntered: false
        });

        if (otpDoc && otpDoc.trials >= 3) {
            return Promise.reject("User Blocked For 10 minutes.")
        }

        if (!otpDoc) {
            const useOtp = new UserOtp({ otp: await this.hashOTP(otp), email });
            await useOtp.save();
        }

        if (otpDoc) {
            await UserOtp.updateOne(
                {
                    _id: otpDoc._id
                },
                {
                    $inc: { trials: 1 },
                    $set: { otp: await this.hashOTP(otp) }
                }
            )
        }

        const res = await transporter.sendMail(mailOptions)

        return;
    }

    async getUserOtp(email) {
        const now = new Date();
        const tenMinutesAgo = new Date(now - 10 * 60 * 1000);

        return UserOtp.findOne({
            email,
            createdAt: { $gte: tenMinutesAgo },
            otpEntered: false
        });
    }

    async verifyUser(email) {
        return Promise.all([UserOtp.updateOne({ email }, { $set: { otpEntered: true } }), User.updateOne({ email }, { $set: { active: true } })])
    }
}

module.exports = new UserService()
