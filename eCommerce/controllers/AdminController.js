const User = require('../models/User')
const UserController = require('../controllers/UserController')

const AdminController = {
    async setLogin(req, res) {
        try {
            // cogemos login + pswd
            const { login, password } = req.body
            // si están vacíos mandamos error
            if (!password || !login) {
                const error = 'Rellena los campos necesarios'
                UserController.renderForm(req, res, null, {login: login, error: error})
            } else {
                // buscamos un ususario con esos datos
                const user = await User.findByCredentials(login, password)
                if (typeof user != 'object') {
                    // si no lo encuentra mandamo error
                    UserController.renderForm(req, res, null, {login: login, error : user})
                } else if (user.role != 'admin'){
                    UserController.renderForm(req, res, null, {login: login, error : 'No tienes permisos para entrar'})
                } else {
                    user.login(req, res)
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    // render del panel de usuario
    async renderPanel(req, res, next, error = null, success = null){
        try {
            const user = await User.getLogged(req)
            const permissions = await user.getUserPermissions()
            res.render('user', {
                title: 'Panel de Usuario',
                user: user,
                error: error,
                success: success,
                permissions: {...permissions},
            })
        } catch (error) {
            console.error(error)
        }
    }
}


module.exports = AdminController;