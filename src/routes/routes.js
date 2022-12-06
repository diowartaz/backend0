const express = require("express");
const router = express.Router();
const routesController = require("../controllers/routesController");

const auth = require("../middlewares/auth");

router.get("/leaderboard", routesController.getLeaderboard);
router.post("/user/xp", auth, routesController.userXP);

module.exports = router;
