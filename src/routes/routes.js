const express = require("express");
const router = express.Router();
const passport = require("passport");
const routesController = require("../controllers/routesController");

router.use(passport.authenticate("jwt", { session: false }));
router.post("/item/find/", routesController.searchForItems);

module.exports = router;
