const express = require('express')
const ContextController = require('../controllers/ContextController')
const router = express.Router()

const UserController = require('../controllers/UserController')

router.get('/',
    UserController.isNotLoggedUser,     // comprobamos que no está loggeado
    UserController.renderForm           // render del login
)
router.post('/',
    UserController.isNotLoggedUser,     // comprobamos que no está loggeado
    ContextController.getPostData,      // cogemos el context.post
    UserController.setLogin,            // hacemos login
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    UserController.goPanel              // redireccionamos al panel
)

router.get('/register',
    UserController.renderRegister,      // decimos que es formulario de registro
    UserController.isNotLoggedUser,     // comprobamos que no está loggeado
    UserController.renderForm           // render del login
)
router.post('/register',
    UserController.renderRegister,      // decimos que es formulario de registro
    UserController.isNotLoggedUser,     // comprobamos que no está loggeado
    ContextController.getPostData,      // cogemos el context.post
    UserController.setRegister,         // registramos el usuario
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    UserController.goPanel              // redireccionamos al panel
)

router.get('/panel',
    UserController.isLoggedUser,        // comprobamos que está loggeado
    UserController.renderPanel          // render del panel de usuario
)
router.post('/panel',
    UserController.isLoggedUser,        // comprobamos que está loggeado
    ContextController.getPostData,      // cogemos el context.post
    UserController.postUser,            // actualizamos el usuario
    ContextController.getExtraVars,     // cogemos errores y parámetros url
    UserController.goPanel              // redireccionamos al panel
)

router.get('/logout',
    UserController.isLoggedUser,        // comprobamos que está loggeado
    UserController.logout               // cerramos sesión
)

module.exports = router
