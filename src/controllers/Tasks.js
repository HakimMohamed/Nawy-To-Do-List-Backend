const constants = require('../constants');
const { asyncHandler } = require('../Utils/asyncHandler');
const TasksService = require('../services/Tasks')

module.exports = {
    getTasks: asyncHandler(async (req, res) => {
        const category = req.query.category;

        const tasks = (await TasksService.getUserTasks(req.user._id, category)) || [];

        return res.status(constants.STATUS_CODES.OK).json({
            success: true,
            message: "Tasks Retrieved Successfully",
            data: tasks
        });
    }),

    createUserTask: asyncHandler(async (req, res) => {
        const { title, _category } = req.body;
        const user = req.user;

        await TasksService.createUserTask({ userId: user._id, title, _category })

        return res.status(constants.STATUS_CODES.CREATED).json({
            success: true,
            message: "Task Created",
            data: ""
        });
    }),

    deleteUserTask: asyncHandler(async (req, res) => {
        const { taskId } = req.query;

        const result = await TasksService.deleteUserTask(taskId)

        if (result && result.acknowledged === true && result.deletedCount === 0) {
            return res.status(constants.STATUS_CODES.CONFLICT).json({
                success: false,
                message: "Task Not Found",
                data: ""
            });
        }

        return res.status(constants.STATUS_CODES.CREATED).json({
            success: true,
            message: "Task Deleted",
            data: ""
        });
    }),

    updateUserTask: asyncHandler(async (req, res) => {
        const { taskId } = req.query;
        const { title, _category, checked } = req.body;

        const result = await TasksService.updateUserTask({ taskId, title, _category, checked })

        if (result && result.acknowledged === true && result.modifiedCount === 0) {
            return res.status(constants.STATUS_CODES.CONFLICT).json({
                success: false,
                message: "Task Not Found",
                data: ""
            });
        }

        return res.status(constants.STATUS_CODES.CREATED).json({
            success: true,
            message: "Task Updated",
            data: ""
        });
    }),
}