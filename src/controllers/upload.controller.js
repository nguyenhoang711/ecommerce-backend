const catchAsync = require('../helpers/catch.async')
const {OK} = require("../core/success.response");
const { UploadService } = require("../services/upload.service");

class UploadController {
    uploadFile = catchAsync(async (req, res) => {
        OK(res, "Upload file success", await UploadService.uploadImageFromUrl())
    })
}

module.exports = new UploadController()