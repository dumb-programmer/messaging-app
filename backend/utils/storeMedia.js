const { writeFile } = require("fs/promises");
const generateFilename = require("./generateFilename");
const { MediaMeta } = require("../models");

const storeMedia = async (mediaList, directory, owners) => {
    const mediaPaths = await Promise.all(mediaList.map(async media => {
        const fileName = generateFilename(media.originalname);
        const filePath = `${directory}/${fileName}`;
        await writeFile(`${__dirname}/../${filePath}`, media.buffer);
        await MediaMeta.create({ fileName, owners })
        return filePath;
    }));
    return mediaPaths;
};

module.exports = storeMedia;