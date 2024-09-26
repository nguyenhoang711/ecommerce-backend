const express = require('express')
const router = express.Router()
const messageController = require('../../controllers/message.controller')
const {authenticationV2} = require("../../auth/authUtils");

// router.use(authenticationV2)
router.post('', messageController.pushMessage)
router.get('',  messageController.getAllMessages)


// router
module.exports = router