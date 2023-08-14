require("dotenv").config();
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

const User = require("./models/user");
const { MediaMeta } = require("./models");
const isAuthorized = require("./middlewares/isAuthorized");
const asyncHandler = require("./utils/asyncHandler");

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to database");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(compression());
app.use(helmet({
    crossOriginResourcePolicy: {
        policy: "cross-origin"
    }
}));

app.use("/uploads/avatars", express.static(path.join(__dirname, "uploads/avatars/")));
if (process.env.NODE_ENV === "production") {
    app.use(RateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 20
    }));
}

app.use(async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.split(" ")[1];
        const isTokenValid = jwt.verify(token, process.env.SECRET);
        if (isTokenValid) {
            req.user = await User.findById(jwt.decode(token)._id);;
        }
    }
    next();
});

app.use("/uploads/media/:fileName", [isAuthorized, asyncHandler(async (req, res, next) => {
    const { fileName } = req.params;
    const fileMeta = await MediaMeta.findOne({ fileName });
    if (!fileMeta) {
        return res.sendStatus(404);
    }
    if (fileMeta.owners.includes(req.user._id)) {
        return res.sendFile(`${__dirname}${req.originalUrl}`);
    }
    res.sendStatus(403);
})]);

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const requestRouter = require("./routes/requestRouter");
const friendRouter = require("./routes/friendRouter");
const messageRouter = require("./routes/messageRouter");

app.use("/api", authRouter);
app.use("/api/users", userRouter);
app.use("/api/requests", requestRouter);
app.use("/api/friends", friendRouter);
app.use("/api/messages", messageRouter);

app.use((req, res, next) => {
    res.status(404).json({ message: "Invalid route" });
});

app.use((err, req, res, next) => {
    if (err.toString().split(": ")[1].toLowerCase() === "unsupported file") {
        return res.status(400).json({ message: [{ path: "avatar", msg: "Unsupported file type, only images are supported" }] });
    }
    if (process.env.NODE_ENV === "development") {
        console.error(err);
    }
    res.status(500).json({ message: "Something went wrong" });
});

app.listen(process.env.PORT, () => console.log(`Server started on port: ${process.env.PORT}`));
