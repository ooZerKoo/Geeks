const mongoose = require('mongoose')
const OrderShcema = mongoose.Schema({
    customer: Object,
    products: [Object],
    totalOrder: Number,
    shipping: Object
})

const Order = mongoose.model('OrderShcema', OrderShcema)