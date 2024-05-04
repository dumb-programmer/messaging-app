const verifyUserOwnership = (req, res, next) => {
    const { userId } = req.params;
    if (userId === req.user._id.toString()) {
        return next();
    }
    res.sendStatus(403);
};

module.exports = verifyUserOwnership;
