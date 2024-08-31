const constants = require('../constants');
const UserService = require('../services/User');
const { asyncHandler } = require('../Utils/asyncHandler');
const validator = require('validator');
const bcrypt = require('bcrypt')

module.exports = {
    getUserById: asyncHandler(async (req, res) => {
        delete req.user._id;

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

        const token = await UserService.register(email, password, name);

        return res.status(constants.STATUS_CODES.CREATED).json({
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