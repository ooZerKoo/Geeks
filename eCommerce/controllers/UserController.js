const User = require('../models/User')
const Password = require('../models/Password')

const UserController = {
    // get /login
    renderLogin(req, res) {
        UserController.renderForm(req, res)
    },
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
                } else {
                    user.login(req, res)
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    renderRegister(req, res) {
        UserController.renderForm(req, res, null, {register: true})
    },
    // post registrarse
    async setRegister(req, res) {
        try {
            // cogemos las variables del cuerpo
            const { ...data } = req.body
            let r = ''
            // comprobamos los datos necesarios y se mandan errores
            if (!data) {
                r = 'Debes rellenar los campos'
            } else if (!data.user) {
                r = 'El nombre de usuario es necesario'
            } else if (!data.email) {
                r = 'El e-mail es necesario'
            } else if(await User.isUserRegistred(data.user)){
                r = 'El nombre de usuario ya está registrado'
            } else if (await User.isUserRegistred(data.email)) {
                r = 'El e-mail ya está registrado'
            } else if (data.password != data.password2) {
                r = 'Las contraseñas no concuerdan'
            } else {
                data.password = await Password.setPassword(data.password)
                // insertamos a la BBDD + creamos la sesión + redireccionamos a su panel de usuario
                User.create(data)
                    .then( user => user.generateAuthToken())
                    .then( user => user.login(req, res))
            }
            let result = {error: r, register: true}
            UserController.renderForm(req, res, null, result)
        } catch (error) {
            console.error(error)
        }
    },
    async updateUser(req, res) {
        try {
            // cogemos variables del cuerpo
            const { ...data } = req.body
            const user = await User.getLogged(req)
            if (data.deleteToken) {
                const token = user.tokens[data.deleteToken]
                if (token) {
                    await user.removeAuthToken(token).then()
                }
                UserController.renderPanel(req, res, null, null, 'Token Eliminado')
            } else if (data.addToken) {
                await user.generateAuthToken()
                UserController.renderPanel(req, res, null, null, 'Token Creado')
            } else {
                // comprobamos que las 2 pswd son iguales y mandamos errores
                if (data.password.length == 0 || data.password2.length == 0) {
                    UserController.renderPanel(req, res, null, 'Rellena las contraseñas')
                } else if (data.password != data.password2) {
                    UserController.renderPanel(req, res, null, 'Las contraseñas no coinciden')
                } else {
                    // encriptamos pasword y lo guardamos
                    const newPassword = await Password.setPassword(data.password)
                    await User.findByIdAndUpdate(
                        user._id,
                        {password: newPassword},
                        {new: true}
                    )
                    UserController.renderPanel(req, res, null, null, 'Contraseña actualizada')
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    // render del formulario
    renderForm(req, res, next, data = null){
        const title = ((data && data.register) ? 'Regístrate' : 'Inicia Sesión')
        res.render('login', {
            title: title,
            data: data
        })
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


module.exports = UserController;