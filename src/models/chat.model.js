const {model, Schema} = require("mongoose");

const DOCUMENT_NAME = 'Message';
const COLLECTION_NAME = 'Messages';

const messageSchema = new Schema({
    message_from: {type: Schema.Types.ObjectId, ref: 'Shop'},
    message_to: {type: Schema.Types.ObjectId, ref: 'Shop'},
    message_content: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'sendOn',
    },
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, messageSchema)