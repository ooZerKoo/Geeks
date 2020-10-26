const Order = require('../models/Order')

const OrderController = {
    async addOrder(req, res, next) {
        try {
            const { user, cart, totalCart } = req.context
            await Order.create({user, cart, totalCart})
            next()
        } catch (error) {
            console.error(error)
        }
        
    }
}

module.exports = OrderController