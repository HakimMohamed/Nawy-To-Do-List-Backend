const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        _user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        title: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model('Category', TaskSchema, 'Categories');

module.exports = Task;
