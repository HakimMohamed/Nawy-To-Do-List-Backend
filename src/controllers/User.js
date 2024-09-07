const constants = require('../constants');
const UserService = require('../services/User');
const { asyncHandler } = require('../Utils/asyncHandler');
const validator = require('validator');
const bcrypt = require('bcrypt')


module.exports = {
    getUserById: asyncHandler(async (req, res) => {
        return res.status(200).json(req.user);
    }),

    register: asyncHandler(async (req, res) => {
        const { email, password, name } = req.body;

        if (!email || !validator.isEmail(email)) {
            return res.status(constants.STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: 'Please enter a valid email',
                data: ''
            })
        }

        if (!password || password.length < 8) {
            return res.status(constants.STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: 'Password Is Required And Must Be Longer Than 8',
                data: ''
            })
        }

        if (!name) {
            return res.status(constants.STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: 'name is required',
                data: ''
            })
        }

        const existingUser = await UserService.getUserByEmail(email);

        if (existingUser) {
            return res.status(constants.STATUS_CODES.CONFLICT).json({
                success: false,
                message: 'User Already Exists.',
                data: ''
            })
        }

        const otp = UserService.generateOTP()

        try {
            await UserService.sendOTP(email, otp)
            return res.status(constants.STATUS_CODES.CREATED).json({
                success: true,
                message: 'Otp sent to your email.',
                data: ""
            })
        } catch (err) {
            if (err === "User Blocked For 10 minutes.") {
                return res.status(constants.STATUS_CODES.TOO_EARLY).json({
                    success: false,
                    message: 'Your Block For 10 minutes due to too many failed otps.',
                    data: ""
                })
            }
            return res.status(constants.STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Error Sending Verification Code.',
                data: ''
            })
        }
    }),

    completeRegistration: asyncHandler(async (req, res, next) => {
        const { email, otp, password, name } = req.body;

        const otpDoc = await UserService.getUserOtp(email);

        if (!otpDoc) {
            return res.status(constants.STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: 'You have to request an otp first.',
                data: ""
            })
        }

        const isMatch = await bcrypt.compare(otp, otpDoc.otp);

        if (!isMatch) {
            return res.status(constants.STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: 'Wrong Otp.',
                data: ""
            })
        }

        const user = await UserService.register(email, password, name)

        await UserService.verifyUser(email)

        const token = await UserService.generateUserToken(email, user._id.toString());

        return res.status(constants.STATUS_CODES.OK).json({
            success: true,
            message: 'Sign up successful.',
            data: token
        })
    }),

    login: asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;

        const userInfo = await UserService.getUserByEmail(email);

        if (!userInfo) {
            return res.status(constants.STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: 'User Not Found.',
                data: ''
            })
        }

        const isPasswordValid = await bcrypt.compare(password, userInfo.password);

        if (!isPasswordValid) {
            return res.status(constants.STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: 'Invalid username or password.',
                data: ''
            })
        }

        const token = await UserService.generateUserToken(email, userInfo._id.toString());

        return res.status(constants.STATUS_CODES.CREATED).json({
            success: true,
            message: 'Sign in successful.',
            data: token
        })
    }),
}