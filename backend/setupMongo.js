const mongoose = require("mongoose");

module.exports = (async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to database");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
