const asyncHandler = (cb) => {
    return (req, res, next) => {
        try {
            cb(req, res, next)
        }
        catch (err) {
            next(err);
        }
    }
};

module.exports = asyncHandler;