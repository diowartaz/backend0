const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");

// /api/user
router.post("/signup", userController.createUser);
router.post("/signin", userController.connexion);

router.use(passport.authenticate("jwt", { session: false }));
router.get("/", userController.listUser);

module.exports = router;
