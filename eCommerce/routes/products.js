const express = require('express')
const router = express.Router()

const CartController = require('../controllers/CartController')
const ProductController = require('../controllers/ProductController')

/* GET product's page. */
router.get('/:url', ProductController.getProduct, ProductController.renderProduct)
router.post('/:url', ProductController.getProduct, ProductController.redirectProduct)

module.exports = router
