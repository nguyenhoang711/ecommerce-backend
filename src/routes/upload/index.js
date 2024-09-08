const express = require('express')
const router = express.Router()
const uploadController = require('../../controllers/upload.controller')
const {authenticationV2} = require("../../auth/authUtils");

// router.use(authenticationV2)
router.post('/product', uploadController.uploadFile)

// router
module.exports = router