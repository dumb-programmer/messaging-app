const { writeFile } = require("fs/promises");
const generateFilename = require("./generateFilename");
const { FileMeta } = require("../models");
const path = require("path");

const storeFiles = async (fileList, directory, owners) => {
  const mediaPaths = await Promise.all(
    fileList.map(async (file) => {
      const fileName = generateFilename(file.originalname);
      const filePath = `${directory}/${fileName}`;
      await writeFile(path.join(__dirname, "..", filePath), file.buffer);
      await FileMeta.create({
        fileName,
        owners,
      });
      return { url: filePath, name: file.originalname };
    })
  );
  return mediaPaths;
};

module.exports = storeFiles;
