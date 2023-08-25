const multer = require("multer");
const isAuthorized = require("../middlewares/isAuthorized");
const asyncHandler = require("../utils/asyncHandler");
const fs = require("fs/promises");

const { Message, Friend, MediaMeta } = require("../models");
const storeMedia = require("../utils/storeMedia");
const { io, getUsers } = require("../socket");

const setupMulter = multer({ storage: multer.memoryStorage() }).array("media");

const areFriends = async (userId, otherUserId) => {
    // Make sure the users are friends
    const friend = await Friend.findOne({
        $or: [
            { user1: userId, user2: otherUserId },
            { user1: otherUserId, user2: userId }
        ]
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
                $or: [
                    { to: req.user._id },
                    { from: req.user._id }
                ]
            }
        },
        {
            $project: {
                user: {
                    $cond: {
                        if: { $eq: ["$to", req.user._id] },
                        then: "$from",
                        else: "$to"
                    }
                },
                content: 1,
                createdAt: 1
            }
        },
        {
            $lookup: {
                localField: "user",
                foreignField: "_id",
                from: "users",
                as: "user"
            }
        },
        {
            $addFields: {
                user: { $arrayElemAt: ["$user", 0] }
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $group: {
                _id: "$user._id",
                latestMessage: { $first: "$$ROOT" }
            }
        },
        {
            $project: {
                _id: 0,
                "latestMessage.user.password": 0,
                "latestMessage.user.bio": 0
            }
        }
    ]);

    res.json({ messages: latestMessages, page: page || 1 });
});

const getMessages = [isAuthorized, getLatestMessages, asyncHandler(async (req, res, next) => {
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
}), asyncHandler(async (req, res, next) => {
    const { userId, page } = req.query;
    const PAGE_SIZE = 10;
    try {
        const messages = await Message.find({
            $or: [
                { from: req.user._id, to: userId },
                { from: userId, to: req.user._id }
            ]
        }).sort({ createdAt: 1 });
        res.json({ messages, page });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid userId" });
        }
        next(error);
    }
})];

const createMessage = [
    isAuthorized,
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
        let media = [];
        if (req.files) {
            media = await storeMedia(req.files, "/uploads/media", [req.user._id, to]);
        }
        const message = await Message.create({ from: req.user._id, to, content, media });
        const toSocket = getUsers()[to]?.socketId;
        const fromSocket = getUsers()[req.user._id.toString()]?.socketId;
        io.to(toSocket).to(fromSocket).emit("new message", message);
        res.sendStatus(200);
    })
];

const updateMessage = [
    isAuthorized,
    setupMulter,
    asyncHandler(async (req, res) => {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);
        if (!message) {
            return res.sendStatus(404);
        }
        if (message.from.toString() === req.user._id.toString()) {
            const { content } = req.body;
            await Message.updateOne({ _id: messageId }, { content });
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    })
];

const deleteMessage = [
    isAuthorized,
    asyncHandler(async (req, res, next) => {
        const { messageId } = req.params;
        try {
            const message = await Message.findById(messageId);
            if (!message) {
                return res.sendStatus(404);
            }
            // current user is the sender of the message
            if (message.from.toString() === req.user._id.toString()) {
                if (message.media.length > 0) {
                    // TODO: Maybe delete media and message at the same time??
                    await Promise.all(message.media.map(async media => {
                        const parts = media.split("/");
                        const fileName = parts[parts.length - 1];
                        return Promise.all([
                            fs.unlink(`${__dirname}/..${media}`),
                            MediaMeta.deleteOne({ fileName })
                        ]);
                    }));
                }
                await Message.deleteOne({ _id: messageId });
                const toSocket = getUsers()[message.to.toString()]?.socketId;
                const fromSocket = getUsers()[req.user._id.toString()]?.socketId;
                io.to(toSocket).to(fromSocket).emit("delete message", message._id.toString());
                return res.sendStatus(200);
            }
            res.sendStatus(403);
        } catch (error) {
            if (error.name === "CastError") {
                return res.status(400).json({ message: "Invalid messageId" });
            }
            next(error);
        }
    })
];

module.exports = { getMessages, createMessage, updateMessage, deleteMessage };
