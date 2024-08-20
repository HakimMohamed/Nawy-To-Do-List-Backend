const constants = require('../constants');
const { asyncHandler } = require('../Utils/asyncHandler');
const TasksService = require('../services/Tasks')

module.exports = {
    getTasks: asyncHandler(async (req, res) => {
        const tasks = (await TasksService.getUserTasks(req.userId)) || [];

        return res.status(constants.STATUS_CODES.OK).json({
            success: true,
            message: "",
            data: tasks
        });
    }),
}