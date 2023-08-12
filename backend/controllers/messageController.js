const multer = require("multer");
const isAuthorized = require("../middlewares/isAuthorized");
const asyncHandler = require("../utils/asyncHandler");
const fs = require("fs/promises");


const { Message, Friend, MediaMeta } = require("../models");
const storeMedia = require("../utils/storeMedia");

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

const getMessages = [isAuthorized, asyncHandler(async (req, res, next) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "userId search query is required" });
    }
    try {
        if (await areFriends(req.user._id, userId)) {
            return next();
        }
        res.status(403).json({ message: "You aren't friends with this user" });
    }
    catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid userId" });
        }
        next(error);
    }
}), asyncHandler(async (req, res, next) => {
    const { userId } = req.query;
    try {
        const messages = await Message.find({
            $or: [
                { from: req.user._id, to: userId },
                { from: userId, to: req.user._id }
            ]
        }).populate("to", { password: 0, bio: 0 }).populate("from", { password: 0, bio: 0 }).sort({ createdAt: 1 });
        res.json({ messages });
    }
    catch (error) {
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
            media = await storeMedia(req.files, `/uploads/media`, [req.user._id, to]);
        }
        await Message.create({ from: req.user._id, to, content, media });
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
        }
        else {
            res.sendStatus(403);
        }
    })
];

const deleteMessage = [
    isAuthorized,
    asyncHandler(async (req, res) => {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);
        if (!message) {
            return res.sendStatus(404);
        }
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
            return res.sendStatus(200);
        }
        res.sendStatus(403);
    })
];

module.exports = { getMessages, createMessage, updateMessage, deleteMessage };