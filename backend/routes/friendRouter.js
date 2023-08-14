const { Router } = require("express");

const router = Router();
const friendsController = require("../controllers/friendController");

router.get("/", friendsController.getFriends);
router.delete("/:friendshipId", friendsController.unfriend);

module.exports = router;
