const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");

// /api/user
router.post("/", userController.createUser);
router.post("/connexion", userController.connexion);

router.use(passport.authenticate("jwt", { session: false }));
router.get("/", userController.listUser);

module.exports = router;
