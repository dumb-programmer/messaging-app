require("dotenv").config();
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const mongoose = require("mongoose");


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

app.use(express.json());
app.use(compression());
app.use(helmet());
if (process.env.NODE_ENV === "production") {
    app.use(RateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 20,
    }));
}

const authRouter = require("./routes/authRouter");

app.use("/api", authRouter);

app.use((req, res, next) => {
    res.status(404).json({ message: "Not found" });
});

app.use((req, res, next, err) => {
    res.status(500).json({ message: "Something went wrong" });
});

app.listen(process.env.PORT, () => console.log(`Server started on port: ${process.env.PORT}`));
