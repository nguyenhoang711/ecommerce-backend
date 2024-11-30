const {Schema, mongoose} = require("mongoose");
const slugify = require('slugify')

const DOCUMENT_NAME = 'Spu';
const COLLECTION_NAME = 'Spus';

const spuSchema = new mongoose.Schema({
    product_id: {type: String, default: ''}, // abc12345
    product_name: { type: String, trim: true, maxLength: 150},
    product_thumb: { type: String, unique: true, trim: true},
    product_description: String,
    product_slug: String,
    product_price: {
        type: Number,
        required: true
    },
    product_category: {
        type: Array,
        default: []
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    /*
        {
            attribute_id: 12456, //style ao, chat lieu
            attribute_values: [
                {
                    value_id: 123,
                    value: "han quoc"
                },
                {
                    value_id: 143,
                    value: "thoi trang"
                },
            ]
        }
     */
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: [],
    },
    /*
        tier_variation:{
            {
                images: [],
                name: 'color',
                options: ['red', 'green', 'blue'],
            },
            {
                images: [],
                name: 'size',
                options: ['S', 'M']
            }
        }
    */
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
});

// create index for search
spuSchema.index({
    product_name: 'text',
    product_description: 'text'
})

// Document middleware runs before .save and .create...
spuSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next()
})

module.exports = model(DOCUMENT_NAME, spuSchema)