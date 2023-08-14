const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    avatar: { type: String, require: true },
    bio: { type: String, default: "" }
});

module.exports = mongoose.model("User", UserSchema);
