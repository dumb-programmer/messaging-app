const { writeFile } = require("fs/promises");
const generateFilename = require("./generateFilename");

const storeAvatar = async (originalName, buffer) => {
    const fileName = generateFilename(originalName);
    const filePath = `uploads/avatars/${fileName}`;
    await writeFile(`${__dirname}/../${filePath}`, buffer);
    return filePath;
};

module.exports = storeAvatar;