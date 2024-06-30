const express = require('express')
const adminController = require('../controller/adminController')
const { upload } = require("../middleware/imageUpload")
const router = express.Router()

router.get("/admin_count",adminController.getAdminCount);

router.get("/cashier_count",adminController.getCashierCount);

router.get("/inventory_count",adminController.getInventoryCount);

router.post("/register",adminController.register);

router.get("/user",adminController.getUser);

module.exports = router