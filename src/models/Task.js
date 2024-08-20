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
        order: {
            type: Number,
            required: true
        },
        checked: {
            type: Boolean,
            default: false
        },
        category: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
