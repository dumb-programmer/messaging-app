const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: Schema.Types.String, require: true },
    lastName: { type: Schema.Types.String, require: true },
    username: { type: Schema.Types.String, require: true, unique: true },
    password: { type: Schema.Types.String, require: true },
    avatar: { type: Schema.Types.String, require: true },
    bio: { type: Schema.Types.String, default: "" },
    status: { type: Schema.Types.String },
    lastSeen: { type: Schema.Types.Date }
});

module.exports = mongoose.model("User", UserSchema);
