const redisPubSubService = require('../src/services/redisPubSub.service')


class InventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(message) {
        console.log(`Updated inventory ${message} with quantity ${message}`);
    }
}

module.exports = new InventoryServiceTest()