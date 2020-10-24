const User = require('../models/User')
const Password = require('../models/Password')

const UserController = {
    // get /login
    renderLogin(req, res) {
        UserController.renderForm(res)
    },
    async setLogin(req, res) {
        try {
            // cogemos login + pswd
            const { login, password } = req.body
            // si están vacíos mandamos error
            if (!password || !login) {
                const error = 'Rellena los campos necesarios'
                UserController.renderForm(res, {login: login}, error)
            } else {
                // buscamos un ususario con esos datos
                const user = await User.findByCredentials(login, password)
                if (typeof user != 'object') {
                    // si no lo encuentra mandamo error
                    UserController.renderForm(res, {login: login}, user)
                } else {
                    user.login(req, res)
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    renderRegister(req, res) {
        UserController.renderForm(res, null, null, true)
    },
    // post registrarse
    async setRegister(req, res) {
        try {
            // cogemos las variables del cuerpo
            const { ...data } = req.body
            // comprobamos los datos necesarios y se mandan errores
            if (!data.user) {
                UserController.renderForm(res, 'El nombre de usuario es necesario', true)
            } else if (!data.email) {
                UserController.renderForm(res, data, 'El e-mail es necesario', true)
            } else if(await User.isUserRegistred(data.user)){
                UserController.renderForm(res, data, 'El nombre de usuario ya está registrado', true)
            } else if (await User.isUserRegistred(data.email)) {
                UserController.renderForm(res, data, 'El e-mail ya está registrado', true)
            } else if (data.password != data.password2) {
                UserController.renderForm(res, data, 'Las contraseñas no concuerdan', true)
            } else {
                data.password = await Password.setPassword(data.password)
                // insertamos a la BBDD + creamos la sesión + redireccionamos a su panel de usuario
                User.create(data)
                    .then( user => user.generateAuthToken())
                    .then( user => user.login(req, res))
            }
        } catch (error) {
            console.error(error)
        }
    },
    logout(req, res) {
        // eliminamos la sesión
        User.logout(req, res)
    },
    async updatePassword(req, res) {
        try {
            // cogemos variables del cuerpo
            const { ...data } = req.body
            // comprobamos que las 2 pswd son iguales y mandamos errores
            if (data.password.length == 0 || data.password2.length == 0) {
                UserController.renderPanel(req, res, null, 'Rellena las contraseñas')
            } else if (data.password != data.password2) {
                UserController.renderPanel(req, res, null, 'Las contraseñas no coinciden')
            } else {
                // encriptamos pasword y lo guardamos
                const newPassword = await Password.setPassword(data.password)
                const loggedUser = req.session.user;
                await User.findByIdAndUpdate(
                    loggedUser._id,
                    {password: newPassword},
                    {new: true}
                )
                UserController.renderPanel(req, res, null, 'Contraseña actualizada')
            }
        } catch (error) {
            console.error(error)
        }
    },
    // render del formulario
    renderForm(res, data, error = null, register = null, admin = null){
        const title = (register ? 'Regístrate' : 'Inicia Sesión') + (admin ? 'como Administrador' : '')
        res.render('login', {
            title: title,
            error: error,
            register: register,
            data : data,
            admin: admin,
        })
    },
    // render del panel de usuario
    renderPanel(req, res, next, error = null){
        res.render('user', {
            title: 'Panel de Usuario',
            user: req.session.user,
            error: error
        })
    }
}


module.exports = UserController;