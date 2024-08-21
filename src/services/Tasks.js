const { default: mongoose } = require("mongoose");
const Task = require("../models/Task")


class TasksService {
    async getUserTasks(userId, category = "") {
        const match = { _user: userId };

        if (category) {
            match.category = category
        }

        return Task.find().sort({ order: -1, createdAt: -1, checked: -1 }).lean();
    }

    async createUserTask(userId, title, _category, order) {
        const newTask = new Task({ _user: userId, title, _category, order })

        return newTask.save();
    }

    async deleteUserTask(taskId) {
        return Task.deleteOne({ _id: new mongoose.Types.ObjectId(taskId) });
    }

    async updateUserTask(taskId, title, _category, order) {
        return Task.updateOne(
            {
                _id: new mongoose.Types.ObjectId(taskId)
            },
            {
                $set: {
                    title,
                    _category: new mongoose.Types.ObjectId(_category),
                    order,
                }
            }
        );
    }

}

module.exports = new TasksService()
