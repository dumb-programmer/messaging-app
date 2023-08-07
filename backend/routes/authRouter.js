const { Router } = require("express");
const router = Router();

const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/signup", authController.signup);

router.use((err, req, res, next) => {
    if (err.toString().split(": ")[1].toLowerCase() === "unsupported file") {
        return res.status(400).json({ message: [{ path: "avatar", msg: "Unsupported file type, only images are supported" }] })
    }
    next(err);
});

module.exports = router;