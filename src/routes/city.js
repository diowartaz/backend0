const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

const auth = require("../middlewares/auth");

router.post("/new", cityController.new);
router.post("/delete", cityController.delete);
router.post("/item/find/:nb", cityController.findItem);
router.post("/wait", cityController.waitForTheAttack);

module.exports = router;