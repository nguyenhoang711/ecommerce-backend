const catchAsync = require('../helpers/catch.async')
const {OK, CREATED} = require("../core/success.response");
const { MessageService } = require("../services/message.service");
class UploadController {
    pushMessage = catchAsync(async (req, res) => {
        CREATED(res, "Push message success", await MessageService.pushMessage(req.body))
    })
    getAllMessages = catchAsync(async (req, res) => {
        OK(res, "Get all message success", await MessageService.getAllMessages(req.body))
    })
}

module.exports = new UploadController()