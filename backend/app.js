const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const { unlink } = require("fs/promises");

const User = require("./models/user");
const { FileMeta, Message } = require("./models");
const isAuthorized = require("./middlewares/isAuthorized");
const asyncHandler = require("./utils/asyncHandler");
const { io, getUsers } = require("./socket");

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
            req.user = await User.findById(jwt.decode(token)._id);
        }
    }
    next();
});

app.get("/uploads/files/:fileName", [isAuthorized, asyncHandler(async (req, res, next) => {
    const { fileName } = req.params;
    const fileMeta = await FileMeta.findOne({ fileName });
    if (!fileMeta) {
        return res.sendStatus(404);
    }
    if (fileMeta.owners.includes(req.user._id)) {
        return res.sendFile(`${__dirname}${req.originalUrl}`);
    }
    res.sendStatus(403);
})]);

app.delete("/uploads/files/:fileName", [isAuthorized, asyncHandler(async (req, res, next) => {
    const { fileName } = req.params;
    const { messageId } = req.body;
    const fileMeta = await FileMeta.findOne({ fileName });
    if (!fileMeta) {
        return res.sendStatus(404);
    }
    const message = await Message.findById(messageId);
    if (!message) {
        return res.sendStatus(404);
    }
    if (fileMeta.owners.includes(req.user._id) && message.from.toString() === req.user._id.toString()) {
        await unlink(`${__dirname}${req.originalUrl}`);
        const newMedia = message.files.filter(file => file !== req.originalUrl);
        const fromSocket = getUsers()[message.from.toString()];
        const toSocket = getUsers()[message.to.toString()];
        if (newMedia.length === 0 && message.content.length === 0) {
            await Message.deleteOne({ _id: message._id });
            io.to(fromSocket).to(toSocket).emit("delete message", message._id.toString());
        } else {
            await Message.updateOne({ _id: messageId }, { files: newMedia });
        }
        await FileMeta.deleteOne({ fileName });
        io.to(fromSocket).to(toSocket).emit("delete file", { messageId: message._id.toString(), file: req.originalUrl });
        return res.sendStatus(200);
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

module.exports = app;
