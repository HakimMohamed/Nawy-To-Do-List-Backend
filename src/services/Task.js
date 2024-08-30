const { default: mongoose } = require("mongoose");
const Task = require("../models/Task")


class TasksService {
    async getUserTasks(userId, category = "") {
        const match = { _user: userId };

        switch (category) {
            case "completed":
                match.checked = true

            case "today":
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                match.createdAt = {
                    $gte: today,
                    $lt: tomorrow
                }
            default:
        }

        return Task.find(match)
            .sort({ checked: 1, createdAt: -1 })
            .lean();
    }

    async createUserTask({ userId, title, _category }) {
        const newTask = new Task({ _user: userId, title, _category, order: 200 })

        return newTask.save();
    }

    async deleteUserTask(taskId) {
        return Task.deleteOne({ _id: new mongoose.Types.ObjectId(taskId) });
    }

    async updateUserTask({ taskId, ...updateFields }) {
        const formattedUpdateFields = Object.fromEntries(
            Object.entries(updateFields).filter(([key, value]) => value != null)
        );

        if (formattedUpdateFields.checked) {
            formattedUpdateFields.order = 0
        }

        return Task.updateOne(
            {
                _id: new mongoose.Types.ObjectId(taskId)
            },
            {
                $set: formattedUpdateFields
            }
        );
    }

}

module.exports = new TasksService()
