const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

// const auth = require("../middlewares/auth");

router.post("/new", cityController.new);
router.post("/delete", cityController.delete);
router.post("/item/find/:nb", cityController.findItem);
router.post("/wait", cityController.waitForTheAttack);
router.post("/build/:id", cityController.build);
router.get("/default-values", cityController.getDefaultValues);
router.post("/learn/:id", cityController.learn);

module.exports = router;
