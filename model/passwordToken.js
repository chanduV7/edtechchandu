const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("TempToken",tokenSchema);