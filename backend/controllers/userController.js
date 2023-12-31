const { unlink } = require("fs/promises");
const { body, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");

const isAuthorized = require("../middlewares/isAuthorized");
const verifyUserOwnership = require("../middlewares/verifyUserOwnership");
const asyncHandler = require("../utils/asyncHandler");
const { User } = require("../models");
const multerSetup = require("../middlewares/multerSetup");
const getHashedPassword = require("../utils/getHashedPassword");
const storeAvatar = require("../utils/storeAvatar");

const getUser = [isAuthorized, asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId, { password: 0 });
    if (!user) {
        return res.sendStatus(404);
    }
    res.json({ user });
})];

const validateUser = [
    body("firstName").optional().notEmpty(),
    body("lastName").optional().notEmpty(),
    body("avatar").optional().notEmpty(),
    (req, res, next) => {
        const { password } = req.body;
        if ((password && password !== "") || password === undefined) {
            return next();
        }
        res.status(400).json({ error: { field: "password", message: "Password is required" } });
    },
    (req, res, next) => {
        const { password, newPassword } = req.body;
        if ((newPassword && newPassword !== "") || password === undefined) {
            return next();
        }
        res.status(400).json({ error: { field: "newPassword", message: "New password is required" } });
    },
    (req, res, next) => {
        const { password, newPassword, confirmPassword } = req.body;
        if (password === undefined) {
            return next();
        }
        if (confirmPassword && confirmPassword !== "") {
            if (confirmPassword === newPassword) {
                return next();
            }
            return res.status(400).json({ error: { field: "confirmPassword", message: "Confirm password must match new password" } });
        }
        return res.status(400).json({ error: { field: "confirmPassword", message: "Confirm password is required" } });
    },
    async (req, res, next) => {
        const { password } = req.body;
        if (password === undefined) {
            return next();
        }
        const result = await bcryptjs.compare(password, req.user.password);
        if (result) {
            return next();
        } else {
            return res.status(403).json({ error: { field: "password", message: "Incorrect password" } });
        }
    }
];

const updateUser = [
    isAuthorized,
    verifyUserOwnership,
    multerSetup(),
    ...validateUser,
    (req, res, next) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            return next();
        }
        res.json({ error: result.array()[0] });
    },
    asyncHandler(async (req, res, next) => {
        // TODO: Make it independent of field order
        const fieldName = Object.keys(req.body)[0];
        const fieldValue = Object.values(req.body)[0];
        switch (fieldName) {
            case "firstName":
            case "lastName":
            case "bio":
                await User.updateOne({ _id: req.user._id }, { [fieldName]: fieldValue });
                break;
            case "password":
                const hashedPassword = await getHashedPassword(req.body.newPassword);
                await User.updateOne({ _id: req.user._id }, { password: hashedPassword });
                break;
            default:
                if (req.file) {
                    const filePath = await storeAvatar(req.file.originalname, req.file.buffer);
                    await unlink(`${__dirname}/../${req.user.avatar}`);
                    await User.updateOne({ _id: req.user._id }, { avatar: filePath });
                    break;
                }
                return res.status(403).json({ message: "Incorrect field" });
        }
        res.json({ message: "User updated", user: await User.findById(req.user.id, { password: 0 }) });
    })
];

const deleteUser = [isAuthorized, verifyUserOwnership, asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.user._id);
    await unlink(`${__dirname}/../${user.avatar}`);
    res.sendStatus(200);
})];

module.exports = { getUser, updateUser, deleteUser };
