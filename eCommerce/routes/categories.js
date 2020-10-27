const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/ProductController')
const CategoryController = require('../controllers/CategoryController')


router.get('/:url',
    CategoryController.getCategory,         // Cogemos la categoría
    ProductController.getProductsCategory,  // Cogemos los Productos
    CategoryController.renderList           // Render del listado
)

// POST PARA ACTUALIZAR CARRITO
router.post('/:url',
    CategoryController.getCategory,         // Cogemos la categoría
    ProductController.getProductsCategory,  // Cogemos los Productos
    CategoryController.renderList           // Render del listado
)

module.exports = router