const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

const User = require("./models/user");
const isAuthorized = require("./middlewares/isAuthorized");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(compression());
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "uploads/avatars/"))
);
if (process.env.NODE_ENV === "production") {
  app.use(
    RateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 20,
    })
  );
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

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const requestRouter = require("./routes/requestRouter");
const friendRouter = require("./routes/friendRouter");
const messageRouter = require("./routes/messageRouter");
const fileRouter = require("./routes/fileRouter");

app.use("/api", authRouter);
app.use("/api/users", userRouter);
app.use("/api/requests", isAuthorized, requestRouter);
app.use("/api/friends", isAuthorized, friendRouter);
app.use("/api/messages", isAuthorized, messageRouter);
app.use("/uploads/files", isAuthorized, fileRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Invalid route" });
});

app.use((err, req, res, next) => {
  if (err.toString().split(": ")[1].toLowerCase() === "unsupported file") {
    return res.status(400).json({
      message: [
        {
          path: "avatar",
          msg: "Unsupported file type, only images are supported",
        },
      ],
    });
  }
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }
  res.status(500).json({ message: "Something went wrong" });
});

module.exports = app;
