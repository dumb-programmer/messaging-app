const multer = require("multer");

const multerSetup = () => multer({
    storage: multer.memoryStorage(), fileFilter: (req, file, cb) => {
        if (/^image\//g.test(file.mimetype)) {
            return cb(null, true);
        }
        return cb(new Error("Unsupported file"), false);
    }
}).single("avatar");

module.exports = multerSetup;