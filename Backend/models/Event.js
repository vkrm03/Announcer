const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    img: { type: String, required: true }
});

module.exports = mongoose.model("Event", EventSchema);
