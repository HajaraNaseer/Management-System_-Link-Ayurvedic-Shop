const express = require('express')
const billController = require('../controller/billController')
const { upload } = require("../middleware/imageUpload")
const router = express.Router()


router.get("/count",billController.getBillCount);

router.post("/add",billController.addBill);

router.post("/get",billController.viewBill);

module.exports = router