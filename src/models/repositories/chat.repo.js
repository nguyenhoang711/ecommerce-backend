const {chat} = require("../chat.model")

const queryUser = async({query}) => {
    return await chat.find(query)
        .populate('from', 'name email avatar')
        .populate('to', 'name email avatar')
        .lean()
        .exec()
}

module.exports = {
    queryUser
}