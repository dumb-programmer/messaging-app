const isAuthorized = require("../middlewares/isAuthorized");
const asyncHandler = require("../utils/asyncHandler");

const { Request } = require("../models");
const { Friend } = require("../models");

const sendRequest = [isAuthorized, asyncHandler(async (req, res, next) => {
    // Check if users are already friends
    const { userId } = req.body;
    // TODO: optimize query
    const [res1, res2] = await Promise.all([
        Friend.findOne({ user1: req.user._id, user2: userId }),
        Friend.findOne({ user1: userId, user2: req.user._id })
    ]);
    if (res1 || res2) {
        return res.status(400).json({ message: "Already friends" });
    }
    next();
}), asyncHandler(async (req, res, next) => {
    // Check if there's already a request from one of the users
    const { userId } = req.body;
    // TODO: optimize query
    const [res1, res2] = await Promise.all([
        Request.findOne({ from: req.user._id, to: userId }),
        Request.findOne({ from: userId, to: req.user._id })
    ]);
    if (res1 || res2) {
        return res.status(409).json({ message: "Request already exists" });
    }
    next();
}), asyncHandler(async (req, res) => {
    const { userId } = req.body;
    await Request.create({ to: userId, from: req.user._id });
    res.sendStatus(200);
})];

const PAGE_SIZE = 10;

const getIncomingRequests = [isAuthorized, asyncHandler(async (req, res) => {
    const { page } = req.query;
    const requests = await Request.find({ to: req.user._id }, { to: 0 }).populate("from", { password: 0, bio: 0 }).limit(PAGE_SIZE).skip((page - 1) * PAGE_SIZE);
    res.json({ requests, page });
})];

const getPendingRequests = [isAuthorized, asyncHandler(async (req, res) => {
    const { page } = req.query;
    const requests = await Request.find({ from: req.user._id }, { from: 0 }).populate("to", { password: 0, bio: 0 }).limit(PAGE_SIZE).skip((page - 1) * PAGE_SIZE);
    res.json({ requests, page });
})];

const acceptRequest = [isAuthorized, asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    try {
        const request = await Request.findByIdAndDelete(requestId);
        if (request && request.to.toString() === req.user._id.toString()) {
            await Friend.create({ user1: req.user._id, user2: request.from });
            return res.sendStatus(200);
        }
        // NOTE: or send 403??
        res.sendStatus(404);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid id" });
        }
        throw error;
    }
})];

const deleteRequest = [isAuthorized, async (req, res) => {
    const { requestId } = req.params;
    const request = await Request.findById(requestId);
    if (request &&
        (request.to.toString() === req.user._id.toString() ||
            request.from.toString() === req.user._id.toString())
    ) {
        await Request.deleteOne({ _id: requestId });
        return res.sendStatus(200);
    }
    res.status(404).json({ message: "Request not found" });
}];

module.exports = { sendRequest, getIncomingRequests, getPendingRequests, acceptRequest, deleteRequest };
