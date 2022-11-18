const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
    name: {
        type: String
    },

    text: {
        type: String
    }
})

module.exports = mongoose.model("Message", MessageSchema);