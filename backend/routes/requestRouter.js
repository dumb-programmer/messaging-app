const { Router } = require("express");

const router = Router();

const requestController = require("../controllers/requestController");

router.post("/", requestController.sendRequest);
router.get("/incoming", requestController.getIncomingRequests);
router.get("/pending", requestController.getPendingRequests);
router.post("/:requestId", requestController.acceptRequest);
router.delete("/:requestId", requestController.deleteRequest);

module.exports = router;