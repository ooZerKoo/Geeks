const Password = require('../models/Password')
const UserController = require('../controllers/UserController')

const AdminController = {
    // get /user
    async getPanel(req, res) {
        try {
            // si está loggeado mostramos su panel de administrador
            if (UserController.isLogged(req) && UserController.isAdmin(req)) {
                AdminController.renderPanel(req, res)
            } else {
                // si no redireccionamos al login
                AdminController.redirectLogin(res)
            }
        } catch (error) {
            console.error(error)
        }
    },
    // get /login
    getLogin(req, res) {
        if(UserController.isLogged(req)) {
            if (UserController.isAdmin(req)){
                // si está loggeado lo mandamos a su panel de administrador
                AdminController.redirectAdmin(res)
            } else {
                // si no redireccionamos al login + error de permisos
                UserController.renderForm(res, req, 'No tienes permisos para acceder a este sitio', null, true)
            }   
        } else {
            // si no redireccionamos al login
            UserController.renderForm(res, null, null, null, true)
        }
    },
    async setLogin(req, res) {
        try {
            // si está loggeado lo mandamos a su panel de administrador
            if (UserController.isLogged(req) && UserController.isAdmin(req)) {
                AdminController.redirectAdmin(res)
            } else {
                // cogemos login + pswd
                const { login, password } = req.body
                // si están vacíos mandamos error
                if (!password || !login) {
                    const error = 'Rellena los campos necesarios'
                    UserController.renderForm(res, {login: login}, error, null, true)
                } else {
                    // buscamos un ususario con esos datos
                    const data = await UserController.findByLogin(login)
                    if (!data) {
                        // si no lo encuentra mandamo error
                        const error = 'No hemos encontrado ningún administrador con este e-mail o nombre de usuario'
                        UserController.renderForm(res, {login: login}, error, null, true)
                    } else {
                        // comprobamos que la contraseña esté bien
                        let check = await Password.checkPassword(password, data.password)
                        if (check) {
                            // creamos la sesión
                            await UserController.loginUser(req, data)
                            // lo mandamos a su panel de administrador
                            AdminController.redirectAdmin(res)
                        } else {
                            // pswd incorrecto le mandamo error
                            const error = 'Contraseña incorrecta'
                            UserController.renderForm(res, data, error, null, true)
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    async logout(req, res) {
        try {
            // eliminamos la sesión
            await UserController.logoutUser(req)
            // redireccionamos a login
            AdminController.redirectLogin(res)
        } catch (error) {
            console.error(error)
        }
    },
    // redireccionamiento al panel del administrador
    redirectAdmin(res){
        res.redirect('/admin')
    },
    // redireccionamiento al formulario de login
    redirectLogin(res){
        res.redirect('/admin/login')
    },
    // render del panel de administrador
    renderPanel(req, res, error = null){
        res.render('user', {
            title: 'Panel de administrador',
            user: UserController.getLoggedUser(req, res),
            error: error,
            admin: true
        })
    }
}


module.exports = AdminController;