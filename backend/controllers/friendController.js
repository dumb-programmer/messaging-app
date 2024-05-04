const asyncHandler = require("../utils/asyncHandler");
const { Friend } = require("../models");

const getFriends = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const PAGE_SIZE = 10;
  const friends = await Friend.find({
    $or: [{ user1: req.user._id }, { user2: req.user._id }],
  })
    .populate("user1", { password: 0, bio: 0 })
    .populate("user2", { password: 0, bio: 0 })
    .limit(PAGE_SIZE)
    .skip((page - 1) * PAGE_SIZE);
  res.json({
    friends: friends.map((friend) => {
      if (friend.user1._id.toString() === req.user._id.toString()) {
        return { _id: friend._id, user: friend.user2 };
      } else if (friend.user2._id.toString() === req.user._id.toString()) {
        return { _id: friend._id, user: friend.user1 };
      }
    }),
    page,
  });
});

const unfriend = asyncHandler(async (req, res) => {
  const { friendshipId } = req.params;
  try {
    const result = await Friend.deleteOne({ _id: friendshipId });
    if (result.deletedCount === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  } catch (error) {
    if (error.name === "CastError") {
      res.sendStatus(400);
    }
  }
});

module.exports = { getFriends, unfriend };
