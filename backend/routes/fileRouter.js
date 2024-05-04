const { deleteFile, getFile } = require("../controllers/fileController");

const router = require("express").Router();

router.get("/:fileName", getFile);
router.delete("/:fileName", deleteFile);

module.exports = router;
