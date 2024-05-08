const multer = require("multer");
const asyncHandler = require("../utils/asyncHandler");
const fs = require("fs/promises");
const { body, validationResult } = require("express-validator");

const { Message, Friend, FileMeta, User } = require("../models");
const { io, getUsers } = require("../socket");
const storeFiles = require("../utils/storeFiles");

const setupMulter = multer({ storage: multer.memoryStorage() }).array("files");

const areFriends = async (userId, otherUserId) => {
  // Make sure the users are friends
  const friend = await Friend.findOne({
    $or: [
      { user1: userId, user2: otherUserId },
      { user1: otherUserId, user2: userId },
    ],
  });
  if (friend) {
    return true;
  }
  return false;
};

const getLatestMessages = asyncHandler(async (req, res, next) => {
  // Get latest one message from/to the currently signed in user
  const { page } = req.query;
  const PAGE_SIZE = 1;
  if (req.query.userId) {
    return next();
  }
  // TODO: Also show the count of unread messages from each user
  const latestMessages = await Message.aggregate([
    {
      $match: {
        $or: [{ to: req.user._id }, { from: req.user._id }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        user: {
          $cond: {
            if: { $eq: ["$to", req.user._id] },
            then: "$from",
            else: "$to",
          },
        },
        content: 1,
        createdAt: 1,
      },
    },
    {
      $lookup: {
        localField: "user",
        foreignField: "_id",
        from: "users",
        as: "user",
      },
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] },
      },
    },
    {
      $group: {
        _id: "$user._id",
        latestMessage: { $first: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        "latestMessage.user.password": 0,
        "latestMessage.user.bio": 0,
      },
    },
  ]);

  res.json({ messages: latestMessages, page: page || 1 });
});

const getMessages = [
  getLatestMessages,
  asyncHandler(async (req, res, next) => {
    const { userId } = req.query;
    try {
      if (await areFriends(req.user._id, userId)) {
        return next();
      }
      res.status(403).json({ message: "You aren't friends with this user" });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid userId" });
      }
      next(error);
    }
  }),
  asyncHandler(async (req, res, next) => {
    const { userId, page } = req.query;
    const PAGE_SIZE = 10;
    try {
      const messages = await Message.find({
        $or: [
          { from: req.user._id, to: userId },
          { from: userId, to: req.user._id },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(PAGE_SIZE)
        .skip((page - 1) * PAGE_SIZE);
      res.json({
        messages: messages.reverse(),
        page,
        hasMore: messages.length > 0,
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid userId" });
      }
      next(error);
    }
  }),
];

const createMessage = [
  setupMulter,
  asyncHandler(async (req, res, next) => {
    const { to } = req.body;
    if (await areFriends(req.user._id, to)) {
      return next();
    }
    res.status(403).json({ message: "You aren't friends with this user" });
  }),
  asyncHandler(async (req, res) => {
    const { to, content } = req.body;
    let files = [];
    if (req.files) {
      files = await storeFiles(req.files, "/uploads/files", [req.user._id, to]);
    }
    const message = await Message.create({
      from: req.user._id,
      to,
      content,
      files,
    });
    const [fromUser, toUser] = await Promise.all([
      User.findById(req.user._id, {
        password: 0,
        bio: 0,
        username: 0,
      }),
      User.findById(to, {
        password: 0,
        bio: 0,
        username: 0,
      }),
    ]);

    const toSocket = getUsers()[to];
    const fromSocket = getUsers()[req.user._id.toString()];
    io.to(toSocket).to(fromSocket).emit("new message", message);

    io.to(toSocket).emit("latest message", { ...message._doc, user: fromUser });
    io.to(fromSocket).emit("latest message", { ...message._doc, user: toUser });
    res.sendStatus(200);
  }),
];

const updateMessage = [
  body("content").notEmpty().withMessage("Content can't be empty"),
  (req, res, next) => {
    // TODO: turn it into a generic middleware
    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }
    res.status(403).json({ message: result.array()[0].msg });
  },
  asyncHandler(async (req, res, next) => {
    const { messageId } = req.params;
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        return res.sendStatus(404);
      } else if (message.from.toString() === req.user._id.toString()) {
        const { content } = req.body;

        await Message.updateOne({ _id: messageId }, { content });

        const updatedMessage = await Message.findOne({ _id: messageId });

        const toSocket = getUsers()[message.to.toString()];
        const fromSocket = getUsers()[req.user._id.toString()];
        io.to(toSocket).to(fromSocket).emit("update message", updatedMessage);

        const friendId =
          message.to.toString() === req.user._id.toString()
            ? message.from
            : message.to;

        const latestMessage = await Message.findOne(
          {
            $or: [
              { from: friendId, to: req.user._id },
              { from: req.user._id, to: friendId },
            ],
          },
          { files: 0, to: 0, from: 0 }
        ).sort({ createdAt: "desc" });

        // If the message being updated is the latest message between the users
        if (latestMessage._id.toString() === message._id.toString()) {
          io.to(fromSocket).emit(
            "update latest message",
            latestMessage,
            friendId
          );
          io.to(toSocket).emit(
            "update latest message",
            latestMessage,
            req.user._id
          );
        }

        res.sendStatus(200);
      } else {
        res.sendStatus(403);
      }
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid messageId" });
      }
      next(error);
    }
  }),
];

const deleteMessage = [
  asyncHandler(async (req, res, next) => {
    const { messageId } = req.params;
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        return res.sendStatus(404);
      }
      // current user is the sender of the message
      if (message.from.toString() === req.user._id.toString()) {
        if (message.files.length > 0) {
          // TODO: Maybe delete file and message at the same time??
          await Promise.all(
            message.files.map(async (file) => {
              const parts = file.split("/");
              const fileName = parts[parts.length - 1];
              return Promise.all([
                fs.unlink(`${__dirname}/..${file}`),
                FileMeta.deleteOne({ fileName }),
              ]);
            })
          );
        }

        const friendId =
          message.to.toString() === req.user._id.toString()
            ? message.from
            : message.to;

        const beforeLatestMessage = await Message.findOne(
          {
            $or: [
              { from: friendId, to: req.user._id },
              { from: req.user._id, to: friendId },
            ],
          },
          { files: 0, to: 0, from: 0 }
        ).sort({ createdAt: "desc" });

        await Message.deleteOne({ _id: messageId });
        const toSocket = getUsers()[message.to.toString()];
        const fromSocket = getUsers()[req.user._id.toString()];
        io.to(toSocket).to(fromSocket).emit("delete message", message);

        // If the message being deleted is the latest message between the users
        if (beforeLatestMessage._id.toString() === message._id.toString()) {
          const latestMessage = await Message.findOne(
            {
              $or: [
                { from: friendId, to: req.user._id },
                { from: req.user._id, to: friendId },
              ],
            },
            { files: 0, to: 0, from: 0 }
          ).sort({ createdAt: "desc" });

          io.to(fromSocket).emit(
            "update latest message",
            latestMessage,
            friendId
          );
          io.to(toSocket).emit(
            "update latest message",
            latestMessage,
            req.user._id
          );
        }

        return res.sendStatus(200);
      }
      res.sendStatus(403);
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid messageId" });
      }
      next(error);
    }
  }),
];

module.exports = { getMessages, createMessage, updateMessage, deleteMessage };
