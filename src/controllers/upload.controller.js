const catchAsync = require('../helpers/catch.async')
const {OK} = require("../core/success.response");
const { UploadService } = require("../services/upload.service");
const { Api401Error } = require('../core/error.response');

class UploadController {
    uploadFile = catchAsync(async (req, res) => {
        OK(res, "Upload file success", await UploadService.uploadImageFromUrl())
    })
    uploadFileThumb = catchAsync(async (req, res) => {
        const {file} = req
        if(!file) throw new BusinessLogicError("Upload thumbnail file from local error")
        
        OK(res, "Upload thumbnail success", await UploadService.uploadImageFromLocal({
            path: file.path
        }))
    })
}

module.exports = new UploadController()