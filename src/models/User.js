const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        name: {
            type: String,
            required: true
        },
        categories: {
            type: [
                {
                    path: {
                        type: String,
                        required: true
                    },
                    category: {
                        type: String,
                        required: true
                    },
                    icon: {
                        type: mongoose.Schema.Types.Mixed,
                        required: true
                    },
                    text: {
                        type: String,
                        required: true
                    },
                }
            ],
            default: []
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model("User", UserSchema, "Users");