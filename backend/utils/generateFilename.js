const crypto = require("crypto");
const path = require("path");

const generateFilename = (originalName) => {
    const fileHash = crypto.randomBytes(16).toString("hex");
    const fileName = fileHash + path.extname(originalName);
    return fileName;
};

module.exports = generateFilename;
