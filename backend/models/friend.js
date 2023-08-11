const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
    user1: { type: Schema.Types.ObjectId, ref: "User", require: true },
    user2: { type: Schema.Types.ObjectId, ref: "User", require: true }
});

module.exports = mongoose.model("Friend", FriendSchema);