const {model, Schema} = require("mongoose");

const DOCUMENT_NAME = 'Message';
const COLLECTION_NAME = 'Messages';

const messageSchema = new Schema({
    from: {type: Schema.Types.ObjectId, ref: 'Shop'},
    to: {type: Schema.Types.ObjectId, ref: 'Shop'},
    message: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'sendOn',
    },
    collection: COLLECTION_NAME
});

module.exports = {
    chat: model(DOCUMENT_NAME, messageSchema)
}