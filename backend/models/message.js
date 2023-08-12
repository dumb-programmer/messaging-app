const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: "User", require: true },
    to: { type: Schema.Types.ObjectId, ref: "User", require: true },
    content: { type: Schema.Types.String, require: true },
    media: { type: [Schema.Types.String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);