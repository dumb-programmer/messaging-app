const { Server } = require("socket.io");
const { User } = require("./models");
const jwt = require("jsonwebtoken");

const io = new Server({
    cors: {
        origin: ["http://localhost:5173"]
    }
});

// TODO: Replace with Redis
const users = {};

io.use(async (socket, next) => {
    const { authorization } = socket.request.headers;
    if (authorization) {
        const token = authorization.split(" ")[1];
        const isTokenValid = jwt.verify(token, process.env.SECRET);
        if (isTokenValid) {
            socket.user = await User.findById(jwt.decode(token)._id, { _id: 1 });
            if (socket.user.status !== "online") {
                await User.updateOne({ _id: socket.user._id }, { status: "online" });
            }
            users[socket.user._id.toString()] = { socketId: socket.id };
        }
    }
    console.log(users);
    next();
});

io.on("connection", socket => {
    socket.on("disconnect", async () => {
        delete users[socket.user._id.toString()];
        await User.updateOne({ _id: socket.user._id }, { lastSeen: new Date() });
    });
});

io.listen(3001);

const getUsers = () => users;

module.exports = { io, getUsers };
