const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserOtp = new Schema(
    {
        email: { type: String, required: true },
        otp: String,
        otpEntered: { type: Boolean, default: false },
        trials: { type: Number, default: 0 },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("UserOtp", UserOtp, "UserOtp");