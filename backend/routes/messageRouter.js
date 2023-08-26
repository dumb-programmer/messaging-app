const { Router } = require("express");

const router = Router();

const messageController = require("../controllers/messageController");

router.get("/", messageController.getMessages);
router.post("/", messageController.createMessage);
router.patch("/:messageId", messageController.updateMessage);
router.delete("/:messageId", messageController.deleteMessage);

module.exports = router;
