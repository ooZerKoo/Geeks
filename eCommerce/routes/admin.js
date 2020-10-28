const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/AdminController')
const CategoryController = require('../controllers/CategoryController')
const ContextController = require('../controllers/ContextController')
const ProductController = require('../controllers/ProductController')
const UserController = require('../controllers/UserController')

/*
    No entra el getExtraVars en la función isNotLoggedAdmin
*/


// LOGIN
router.get('/',
    UserController.isNotLoggedAdmin,    // comprobamos si está loggeado
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    UserController.renderForm           // mostramos el login
)
router.post('/',
    UserController.isNotLoggedAdmin,    // comprobamos si está loggeado
    ContextController.getPostData,      // cogemos las variables en context.post
    AdminController.setLogin,           // loggeamos el usuario
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    UserController.goPanel              // redireccionamos al panel de amdmin
)
// LOGOUT
router.get('/logout',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    UserController.logout               // cerramos sesión
)

// PANEL - HOME
router.get('/panel',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    AdminController.renderPanel         // rendarizamos el panel de admin
)

// PANEL - PRODUCTS
router.get('/panel/products',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    AdminController.renderProducts
)
router.post('/panel/products',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    ProductController.postProduct,      // actualizamos / insertamos Producto
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    AdminController.renderProducts ,    // rendarizamos el panel de Produtos
)

// PANEL - ORDERS
router.get('/panel/orders',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    AdminController.renderOrders        // rendarizamos el panel de Pedidos
)

// PANEL - CATEGORIES
router.get('/panel/categories',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    AdminController.renderCategories    // rendarizamos el panel de Categorías
)
router.post('/panel/categories',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    CategoryController.postCategory,    // actualizamos / insertamos Categoría
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    AdminController.renderCategories,   // rendarizamos el panel de Categorías
)

// PANEL - CUSTOMERS
router.get('/panel/customers',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    AdminController.renderCustomers     // rendarizamos el panel de Clientes
)
router.post('/panel/customers',
    UserController.isLoggedAdmin,       // comprobamos si está loggeado
    UserController.postUser,            // actualizamos / insertamos Cliente
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    AdminController.renderCustomers,    // rendarizamos el panel de Clientes
)

module.exports = router