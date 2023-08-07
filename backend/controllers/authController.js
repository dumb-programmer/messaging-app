const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const { writeFile } = require("fs/promises");
const asyncHandler = require("../utils/asyncHandler");

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
    multer({
        storage: multer.memoryStorage(), fileFilter: (req, file, cb) => {
            if (/^image\//g.test(file.mimetype)) {
                return cb(null, true);
            }
            return cb(new Error("Unsupported file"), false);
        }
    }).single("avatar"),
    ...validateUser,
    userExists,
    asyncHandler(async (req, res, next) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const { username, password, firstName, lastName, bio } = req.body;

            const fileHash = crypto.randomBytes(16).toString("hex");
            const fileName = fileHash + path.extname(req.file.originalname);
            const filePath = `uploads/avatars/${fileName}`;
            await writeFile(`${__dirname}/../${filePath}`, req.file.buffer);

            const salt = await bcryptjs.genSalt();
            const hashedPassword = await bcryptjs.hash(password, salt);
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
                        const { _id, username, firstName, lastName, avatar } = user;
                        res.json({ token, user: { _id, firstName, lastName, username, avatar } });
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