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
                const success = []
                // añadimos el producto al carrito
                if ( addToCart ) {
                    const inCart = finalCart.filter(v => v.id == addToCart)
                    finalCart = finalCart.filter(v => v.id != addToCart)
                    if (inCart.length > 0) {
                        inCart[0].quantity++
                        finalCart.push(inCart[0])
                    } else {
                        finalCart.push({id: addToCart, quantity: 1})
                    }
                    success.push(4002)
                }
                
                
                // eliminamos el producto del carrito
                if ( deleteCart ) {
                    const inCart = finalCart.filter(v => v.id == deleteCart)
                    finalCart = finalCart.filter(v => v.id != deleteCart)
                    if (inCart.length > 0) {
                        inCart[0].quantity--
                        if (inCart[0].quantity > 0) {
                            finalCart.push(inCart[0])
                        }
                    }
                    success.push(4001)
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
                        let product = await Product.findById(finalCart[c].id)
                        product.cartQuantity = finalCart[c].quantity
                        products.push( product )
                    }
                }
                req.context.cart = products

                var total = 0
                var cartQuantity = 0
                for (i in products) {
                    total += products[i].finalPrice * products[i].cartQuantity
                    cartQuantity += products[i].cartQuantity
                }
                req.context.totalCart =  Math.round( total * 100 + Number.EPSILON ) / 100 ;
                req.context.cartQuantity =  cartQuantity
            }
            next()
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = CartController