const {Api403Error} = require("../../core/error.response");
const validateLoginRequest = (req, res, next) => {
    const loginRequest = req.body
    console.log(loginRequest)
    // check email
    if (!loginRequest.username || loginRequest.username.length < 8) {
        throw new Api403Error('Email invalid')
    }
    // check password
    if (!loginRequest.password || loginRequest.password.length < 8) {
        throw new Api403Error('Password invalid')
    }

    return next()
}

const validateRegister = (req, res, next) => {
    const registerRequest = req.body
    // check name
    if (!registerRequest.name || registerRequest.name.length < 8) {
        throw new Api403Error('Name invalid')
    }
    // check email
    if (!registerRequest.email || registerRequest.email.length < 8) {
        throw new Api403Error('Email invalid')
    }
    // check password
    if (!registerRequest.password || registerRequest.password.length < 8) {
        throw new Api403Error('Password invalid')
    }
    // check msisdn
    if (!registerRequest.msisdn || registerRequest.msisdn.length < 10) {
        throw new Api403Error('Msisdn invalid')
    }

    return next()
}
module.exports = {
    validateLoginRequest,
    validateRegister
}
