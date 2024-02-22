const { writeFile } = require("fs/promises");
const generateFilename = require("./generateFilename");
const { FileMeta } = require("../models");
const path = require("path");

const storeFiles = async (mediaList, directory, owners) => {
  const mediaPaths = await Promise.all(
    mediaList.map(async (media) => {
      const fileName = generateFilename(media.originalname);
      const filePath = `${directory}/${fileName}`;
      await writeFile(path.join(__dirname, "..", filePath), media.buffer);
      await FileMeta.create({ fileName, owners });
      return filePath;
    })
  );
  return mediaPaths;
};

module.exports = storeFiles;
