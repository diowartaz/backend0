const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

// const auth = require("../middlewares/auth");

router.get("/", playerController.player);
router.get("/data", playerController.data);
router.get("/city", playerController.city);

module.exports = router;