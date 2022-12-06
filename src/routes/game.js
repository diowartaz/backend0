const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

// const auth = require("../middlewares/auth");

router.get("/", gameController.game);
router.get("/xp", gameController.xp);
router.get("/city", gameController.city);

module.exports = router;