const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true }
});

module.exports = mongoose.model("Request", RequestSchema);
