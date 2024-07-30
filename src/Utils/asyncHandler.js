const constants = require('../constants');

exports.asyncHandler = function (callback) {
    return async function (req, res, next) {
        try {
            await callback(req, res, next);
        } catch (error) {
            return res.status(constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error.',
                data: ''
            });
        }
    };
};

