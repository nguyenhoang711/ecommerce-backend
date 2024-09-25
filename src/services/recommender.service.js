const {BusinessLogicError, Api404Error} = require("../core/error.response");
const crypto = require("crypto");
const i18n = require("../configs/config.i18n");
const {getInfoData} = require("../utils");
const { OK } = require("../core/success.response");

class UserService {

    findUserByEmail = async ({email}) => {
        return userModel.findOne({usr_email: email}).lean();
    }

}

module.exports = new UserService()
