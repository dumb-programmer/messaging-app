const { FileMeta, Message } = require("../models");
const { getUsers, io } = require("../socket");
const asyncHandler = require("../utils/asyncHandler");
const { unlink } = require("fs/promises");
const path = require("path");

const getFile = asyncHandler(async (req, res, next) => {
  const { fileName } = req.params;
  const fileMeta = await FileMeta.findOne({ fileName });
  if (!fileMeta) {
    return res.sendStatus(404);
  }
  if (fileMeta.owners.includes(req.user._id)) {
    return res.sendFile(
      path.join(__dirname, "..", "/uploads/files/", fileName)
    );
  }
  res.sendStatus(403);
});

const deleteFile = asyncHandler(async (req, res, next) => {
  const { fileName } = req.params;
  const { messageId } = req.body;
  const fileMeta = await FileMeta.findOne({ fileName });
  if (!fileMeta) {
    return res.sendStatus(404);
  }
  const message = await Message.findById(messageId);
  if (!message) {
    return res.sendStatus(404);
  }
  if (
    fileMeta.owners.includes(req.user._id) &&
    message.from.toString() === req.user._id.toString()
  ) {
    await unlink(path.join(__dirname, "..", "/uploads/files/", fileName));
    const newFiles = message.files.filter(
      (file) => file.url !== req.originalUrl
    );
    const fromSocket = getUsers()[message.from.toString()];
    const toSocket = getUsers()[message.to.toString()];
    // The message only contains a file
    if (newFiles.length === 0 && message.content.length === 0) {
      console.log("delete message");
      await Message.deleteOne({ _id: message._id });
      io.to(fromSocket).to(toSocket).emit("delete message", message);
    } else {
      await Message.updateOne({ _id: messageId }, { files: newFiles });
    }
    await FileMeta.deleteOne({ fileName });
    io.to(fromSocket).to(toSocket).emit("delete file", {
      messageId: message._id.toString(),
      file: req.originalUrl,
    });
    return res.sendStatus(200);
  }
  res.sendStatus(403);
});

module.exports = { getFile, deleteFile };
