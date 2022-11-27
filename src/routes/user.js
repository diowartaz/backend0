const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

// /api/user
router.post("/signup", userController.createUser);
router.post("/signin", userController.connexion);
// router.get("/", userController.listUser);

module.exports = router;
