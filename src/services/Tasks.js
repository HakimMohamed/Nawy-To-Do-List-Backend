const Task = require("../models/Task")


class TasksService {
    async getUserTasks(userId) {
        return Task.findById(userId).lean();
    }
}

module.exports = new TasksService()
