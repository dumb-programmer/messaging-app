const mongoose = require("mongoose");

module.exports = (async () => {
  try {
    await mongoose.connect(
      process.env.NODE_ENV === "production"
        ? process.env.DB_PROD
        : process.env.DB_DEV
    );
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
