const redisPubSubService = require('../src/services/redisPubSub.service')

class ProductServiceTest {

    purchaseProduct( productId, quantity) {
        const order = {
            productId,
            quantity
        }
        console.log('productId: ', productId);
        console.log('quantity: ', quantity);
        
        redisPubSubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = new ProductServiceTest()