const { Router } = require("express");
const router = Router();

const userController = require("../controllers/userController");

router.get("/:userId", userController.getUser);
router.patch("/:userId", userController.updateUser);
router.delete("/:userId", userController.deleteUser);

module.exports = router;
