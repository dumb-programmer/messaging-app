const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mediaMetaSchema = new Schema({
    fileName: { type: Schema.Types.String, require: true, unique: true },
    owners: { type: [Schema.Types.ObjectId], require: true }
});

module.exports = mongoose.model("MediaMeta", mediaMetaSchema);