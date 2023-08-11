const crypto = require("crypto");
const path = require("path");
const { writeFile } = require("fs/promises");

const storeAvatar = async (originalName, buffer) => {
    const fileHash = crypto.randomBytes(16).toString("hex");
    const fileName = fileHash + path.extname(originalName);
    const filePath = `uploads/avatars/${fileName}`;
    await writeFile(`${__dirname}/../${filePath}`, buffer);
    return filePath;
};

module.exports = storeAvatar;