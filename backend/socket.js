const { Server } = require("socket.io");
const { User, Friend } = require("./models");
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
            users[socket.user._id.toString()] = socket.id;
        }
    }
    console.log(users);
    next();
});

io.on("connection", async socket => {
    const friends = await Friend.aggregate([
        {
            $match: {
                $or: [
                    { user1: socket.user._id },
                    { user2: socket.user._id }
                ]
            }
        },
        {
            $project: {
                user: {
                    $cond: {
                        if: { $eq: [socket.user._id, "$user1"] },
                        then: "$user2",
                        else: "$user1"
                    }
                }
            }
        }
    ]);

    // Broadcast user's online status to their friends
    friends.forEach(({ user: friendId }) => {
        const friendSocketId = users[friendId.toString()];
        if (friendSocketId) {
            io.to(friendSocketId).emit("user status changed", { userId: socket.user._id.toString(), type: "online" });
        }
    });

    socket.on("disconnect", async () => {
        delete users[socket.user._id.toString()];

        const lastSeen = new Date();
        await User.updateOne({ _id: socket.user._id }, { lastSeen, status: "offline" });

        // Broadcast user's offline status to their friends
        friends.forEach(({ user: friendId }) => {
            const friendSocketId = users[friendId.toString()];
            if (friendSocketId) {
                io.to(friendSocketId).emit("user status changed", { userId: socket.user._id.toString(), type: "offline", lastSeen });
            }
        });
    });

    socket.on("typing", (toUserId) => {
        const socketId = users[toUserId];
        io.to(socketId).emit("typing");
    });
});

io.listen(3001);

const getUsers = () => users;

module.exports = { io, getUsers };
