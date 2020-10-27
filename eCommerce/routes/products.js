const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/ProductController')


router.get('/:url',
    ProductController.getProduct,       // cogemos el producto desde la URL
    ProductController.renderProduct     // mostramos el producto
)

// POST PARA ACTUALIZAR EL CARRITO
router.post('/:url',
    ProductController.getProduct,       // cogemos el producto desde la URL
    ProductController.redirectProduct   // redireccionamos al producto (se ha añadido al carrito)
)

module.exports = router
