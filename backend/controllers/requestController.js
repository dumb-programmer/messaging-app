const asyncHandler = require("../utils/asyncHandler");

const { Friend, Request, User } = require("../models");

const sendRequest = [
  asyncHandler(async (req, res, next) => {
    // Check if users are already friends
    const { username } = req.body;
    if (!username || req.user.username === username) {
      return res.send(400).json({ message: "username is required" });
    }
    const userId = (await User.findOne({ username }))?._id;
    if (!userId) {
      return res.send(404).json({ message: "No such user exists" });
    }
    req.userId = userId;
    // TODO: optimize query
    const [res1, res2] = await Promise.all([
      Friend.findOne({ user1: req.user._id, user2: userId }),
      Friend.findOne({ user1: userId, user2: req.user._id }),
    ]);
    if (res1 || res2) {
      return res.status(409).json({ message: "Already friends" });
    }
    next();
  }),
  asyncHandler(async (req, res, next) => {
    // Check if there's already a request from one of the user
    // TODO: optimize query
    const [res1, res2] = await Promise.all([
      Request.findOne({ from: req.user._id, to: req.userId }),
      Request.findOne({ from: req.userId, to: req.user._id }),
    ]);
    if (res1 || res2) {
      return res.status(409).json({ message: "Request already exists" });
    }
    next();
  }),
  asyncHandler(async (req, res) => {
    await Request.create({ to: req.userId, from: req.user._id });
    res.sendStatus(200);
  }),
];

const PAGE_SIZE = 10;

const getIncomingRequests = [
  asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const requests = await Request.find({ to: req.user._id }, { to: 0 })
      .populate("from", { password: 0, bio: 0 })
      .limit(PAGE_SIZE)
      .skip((page - 1) * PAGE_SIZE);
    res.json({ requests, page, hasMore: requests.length > 0 });
  }),
];

const getPendingRequests = [
  asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const requests = await Request.find({ from: req.user._id }, { from: 0 })
      .populate("to", { password: 0, bio: 0 })
      .limit(PAGE_SIZE)
      .skip((page - 1) * PAGE_SIZE);
    res.json({ requests, page, hasMore: requests.length > 0 });
  }),
];

const acceptRequest = [
  asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    try {
      const request = await Request.findOneAndDelete({
        _id: requestId,
        to: req.user._id,
      });
      if (request) {
        await Friend.create({ user1: req.user._id, user2: request.from });
        return res.sendStatus(200);
      }
      // NOTE: or send 403??
      return res.sendStatus(404);
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid id" });
      }
      throw error;
    }
  }),
];

const deleteRequest = [
  async (req, res) => {
    const { requestId } = req.params;
    const request = await Request.findById(requestId);
    console.log(request);
    if (
      request &&
      (request.to._id.toString() === req.user._id.toString() ||
        request.from._id.toString() === req.user._id.toString())
    ) {
      await Request.deleteOne({ _id: requestId });
      return res.sendStatus(200);
    }
    res.status(404).json({ message: "Request not found" });
  },
];

module.exports = {
  sendRequest,
  getIncomingRequests,
  getPendingRequests,
  acceptRequest,
  deleteRequest,
};
