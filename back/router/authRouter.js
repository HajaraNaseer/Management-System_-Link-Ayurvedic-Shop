const express = require('express')
const authController = require('../controller/authController')
const router = express.Router()

router.post("/signin",authController.signin);

router.get("/verify",authController.verify);

router.post("/change_password",authController.changePassword);

router.get("/logout",authController.logout);

module.exports = router