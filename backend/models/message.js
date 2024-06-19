const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new mongoose.Schema({
  url: {
    type: mongoose.Schema.Types.String, // You can use ObjectId for the id field if it's a reference to another document
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const messageSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", require: true },
    to: { type: Schema.Types.ObjectId, ref: "User", require: true },
    content: { type: Schema.Types.String, require: true },
    files: { type: [fileSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
