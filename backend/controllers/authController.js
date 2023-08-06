const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");

const validateUser = [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("username").notEmpty(),
    body("password").notEmpty(),
];

const signup = [
    ...validateUser,
    asyncHandler(async (req, res, next) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const { username, password, firstName, lastName } = req.body;
            const user = await User.findOne({ username });
            console.log(user);
            if (user) {
                res.status(409).json({ message: "User with this username already exists please use a unique username" });
            }
            else {
                const salt = await bcryptjs.genSalt();
                const hashedPassword = await bcryptjs.hash(password, salt);
                await User.create({ username, password: hashedPassword, firstName, lastName });
                res.json({ message: "User created successfully" });
            }
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
                        console.log("Matched");
                        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
                        res.json({ token });
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

module.exports = { signup, login }