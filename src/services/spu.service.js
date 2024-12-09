const { Api404Error } = require("../core/error.response")
const { NOT_FOUND } = require("../core/reasonPhrases")
const { findShopById } = require("../models/repositories/shop.repo")
const SPU_MODEL = require("../models/spu.model")
const { randomProductId } = require("../utils")


const newSpu = async ({
    product_id,
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_quantity,
    product_variations,
    sku_list = [],
}) => {
    // 1. check if shop exits
    const foundShop = await findShopById({
        shop_id: product_shop,
    })

    if(!foundShop) throw new Api404Error("Shop not found")
    // 2. create new SPU
    const spu = await SPU_MODEL.create({
        product_id: randomProductId(),
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_category,
        product_shop,
        product_attributes,
        product_quantity,
        product_variations,
    })

    if(spu && sku_list.length) {
        // 3. create new SKU
    }

}