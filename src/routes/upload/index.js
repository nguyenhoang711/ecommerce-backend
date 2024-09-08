const express = require('express')
const router = express.Router()
const uploadController = require('../../controllers/upload.controller')
const {authenticationV2} = require("../../auth/authUtils");
const { uploadDisk } = require('../../configs/config.multer');

// router.use(authenticationV2)
router.post('/product', uploadController.uploadFile)
router.post('/product/thumb', uploadDisk.single('file'), uploadController.uploadFileThumb)


// router
module.exports = router