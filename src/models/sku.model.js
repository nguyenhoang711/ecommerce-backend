const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = 'Sku'
const COLLECTION_NAME = 'Skus'


const skuSchema = new Schema({
    sku_id: { type: String, required: true, unique: true},
    sku_tire_idx: {type: Array, default: [0]}, // [1, 0], [1, 1]
    /**
     * color = [red, green] = [0, 1]
     * size = [S, M] = [1, 1]
     * => red + S = [0, 0]
     * => green + M = [1, 1]
     */
    sku_default: {type: Boolean, default: false},
    sku_slug: {type: String, default: ''},
    sku_sort: {type: Number, default: 0},
    sku_price: {type: String, require: true},
    sku_stock: {type: Number, default: 0},
    product_id: {type: String, required: true}, // ref to spu model
    isDraft: {
        type: Boolean,
        default: true, // khong dk select ra
        index: true,
        select: false // khong lay field nay ra
    },
    isPublished: {
        type: Boolean,
        default: false, // khong dk select ra
        index: true,
        select: false // khong lay field nay ra
    },
    isDeletedd: {
        type: Boolean,
        default: false, // khong dk select ra
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, skuSchema)