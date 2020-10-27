const ProductController = require('../controllers/ProductController')
const User = require('../models/User')
const Product = require('../models/Product')

const CartController = {
    async updateCart(req, res, next) {
        try {
            const context = req.context
            // si hay contexto montamos el carrito
            if (context) {
                const { user } = req.context
                const { addToCart, deleteCart } = req.body
                
                const cart = req.session.cart
                var finalCart = cart
                
                // añadimos el producto al carrito
                if ( addToCart ) {
                    finalCart.push(addToCart)
                    req.context.post.success = 4002
                }
                
                
                // eliminamos el producto del carrito
                if ( deleteCart ) {
                    finalCart = cart.filter(v => v != deleteCart)
                    req.context.post.success = 4001
                }
                
                // lo guardamos a la BBDD
                if ( user ) {
                    req.context.user = await User.findByIdAndUpdate(user._id, {cart: finalCart}, {new: true})              
                }
                req.session.cart = finalCart

                // creamos el context del carrito
                const products = []
                if (Array.isArray(finalCart)) {
                    for (c in finalCart) {
                        let product = await Product.findById(finalCart[c])
                        products.push(product)
                    }
                }
                req.context.cart = products

                var total = 0
                for (i in products) {
                    total += products[i].finalPrice
                }
                req.context.totalCart =  Math.round( total * 100 + Number.EPSILON ) / 100 ;
            }
            next()
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = CartController