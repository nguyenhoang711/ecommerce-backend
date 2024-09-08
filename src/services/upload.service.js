const cloudinary = require('../configs/config.cloudinary')

class UploadService {
    static  uploadImageFromUrl = async () => {
        try {
            const urlImage = 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lgurcl7xiwab80'
            const folderName = '/products/8409', newFileName = 'demo'
    
            const result = await cloudinary.uploader.upload(urlImage, {
                public_id: newFileName,
                folder: folderName
            })
    
            console.log(result)
            return result
        } catch (e) {
            console.error(e)
        }
    }
}

module.exports = {
    UploadService
}
