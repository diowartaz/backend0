const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

// /api/user


/**
 * @swagger
 * /signup:
 *  post:
 *      description: egegerg
 */
router.post("/signup", userController.createUser);

/**
 * @swagger
 * /signin:
 *  post:
 *      description: egegerg
 */
router.post("/signin", userController.connexion);
// router.get("/", userController.listUser);

module.exports = router;
