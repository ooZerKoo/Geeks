const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/AdminController')
const CategoryController = require('../controllers/CategoryController')
const ContextController = require('../controllers/ContextController')
const ProductController = require('../controllers/ProductController')
const UserController = require('../controllers/UserController')


// LOGIN
router.get('/',
    UserController.isNotLoggedAdmin,    // comprobamos si está loggeado
    UserController.renderForm           // mostramos el login
)
router.post('/',
    UserController.isNotLoggedAdmin,    // comprobamos si está loggeado
    ContextController.getPostData,      // cogemos las variables en context.post
    AdminController.setLogin,           // loggeamos el usuario
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    UserController.goPanel              // redireccionamos al panel de amdmin
)
// LOGOUT
router.get('/logout',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    UserController.logout               // cerramos sesión
)

// PANEL - HOME
router.get('/panel',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    AdminController.renderPanel         // rendarizamos el panel de admin
)

// PANEL - PRODUCTS
router.get('/panel/products',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    AdminController.renderProducts
)
router.post('/panel/products',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    ProductController.postProduct,      // actualizamos / insertamos Producto
    AdminController.renderProducts      // rendarizamos el panel de Produtos
)

// PANEL - ORDERS
router.get('/panel/orders',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    AdminController.renderOrders        // rendarizamos el panel de Pedidos
)
router.get('/panel/categories',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    AdminController.renderCategories    // rendarizamos el panel de Categorías
)

// PANEL - CATEGORIES
router.post('/panel/categories',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    CategoryController.postCategory,    // actualizamos / insertamos Categoría
    AdminController.renderCategories    // rendarizamos el panel de Categorías
)

// PANEL - CUSTOMERS
router.get('/panel/customers',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    AdminController.renderCustomers     // rendarizamos el panel de Clientes
)
router.post('/panel/customers',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    UserController.postUser,            // actualizamos / insertamos Cliente
    AdminController.renderCustomers     // rendarizamos el panel de Clientes
)

module.exports = router