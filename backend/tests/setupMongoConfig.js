const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const initializeMongoServer = async () => {
    const mongoServer = await MongoMemoryServer.create();
    const mongoURI = mongoServer.getUri();

    mongoose.connect(mongoURI);

    mongoose.connection.on("error", e => {
        console.log(e);
        if (e.message.code === "ETIMEDOUT") {
            mongoose.connect(mongoURI);
        }
    });
    mongoose.connection.once("open", () => {
        console.log(`MongoDB successfully connected to ${mongoURI}`);
    });
};

module.exports = initializeMongoServer;
