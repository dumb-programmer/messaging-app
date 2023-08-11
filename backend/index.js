require("dotenv").config();
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("./models/user");

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected to database");
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})()

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(compression());
app.use(helmet({
    crossOriginResourcePolicy: {
        policy: "cross-origin"
    }
}));
app.use("/uploads/avatars", express.static(__dirname + "/uploads/avatars/"));
if (process.env.NODE_ENV === "production") {
    app.use(RateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 20,
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
})

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

app.use("/api", authRouter);
app.use("/api/users", userRouter);

app.use((req, res, next) => {
    res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
    if (err.toString().split(": ")[1].toLowerCase() === "unsupported file") {
        return res.status(400).json({ message: [{ path: "avatar", msg: "Unsupported file type, only images are supported" }] })
    }
    if (process.env.NODE_ENV === "development") {
        console.error(err);
    }
    res.status(500).json({ message: "Something went wrong" });
});

app.listen(process.env.PORT, () => console.log(`Server started on port: ${process.env.PORT}`));
