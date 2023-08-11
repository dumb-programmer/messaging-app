const { User } = require("../models");
const { body, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const multerSetup = require("../middlewares/multerSetup");
const getHashedPassword = require("../utils/getHashedPassword");
const storeAvatar = require("../utils/storeAvatar");

const validateUser = [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("username").notEmpty(),
    body("password").notEmpty(),
    (req, res, next) => {
        if (req.file) {
            return next();
        }
        res.status(400).json({
            message: [{
                path: "avatar", msg: "Invalid value"
            }]
        });
    }
];


const userExists = async (req, res, next) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        return res.status(409).json({ message: "User with this username already exists please use a unique username" });
    }
    next();
}

const signup = [
    multerSetup(),
    ...validateUser,
    userExists,
    asyncHandler(async (req, res, next) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const { username, password, firstName, lastName, bio } = req.body;

            const filePath = await storeAvatar(req.file.originalname, req.file.buffer);

            const hashedPassword = await getHashedPassword(password);
            await User.create({ username, password: hashedPassword, firstName, lastName, bio, avatar: filePath });
            res.json({ message: "User created successfully" });
        }
        else {
            res.status(400).json({ message: result.array() });
        }
    })
];

const login = [
    body("username").notEmpty(),
    body("password").notEmpty(),
    asyncHandler(async (req, res, next) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (user) {
                bcryptjs.compare(password, user.password, (err, isEqual) => {
                    if (err) {
                        throw err;
                    }
                    if (isEqual) {
                        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
                        const { _id, username, firstName, lastName, avatar, bio } = user;
                        res.json({ token, user: { _id, firstName, lastName, username, avatar, bio } });
                    }
                    else {
                        res.status(401).json({ message: "Incorrect password" });
                    }
                });
            }
            else {
                res.status(404).json({ message: "No such user exists" });
            }
        }
        else {
            res.status(400).json({ message: result.array() });
        }
    })
];

module.exports = { signup, login };