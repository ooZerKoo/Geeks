const User = require('../models/User')

const UserController = {
    async setLogin(req, res, next) {
        try {
            // cogemos login + pswd
            const { login, password } = req.body
            let error = ''
            let success = ''
            // si están vacíos mandamos error
            if (!password || !login) {
                error = 'Rellena los campos necesarios'
            } else {
                user = await User.findByCredentials(login, password)
                if (typeof user != 'object') {
                    error = user
                }
            }
            req.extraVars.error = error
            req.extraVars.success = success
            if (typeof user == 'object') {
                user.login(req, res, next)
            } else {
                next()
            }
        } catch (error) {
            console.error(error)
        }
    },
    renderRegister(req, res, next) {
        if (!req.extraVars) req.extraVars = {}
        req.extraVars.register = 1
        next()
    },
    // post registrarse
    async setRegister(req, res, next) {
        try {
            // cogemos las variables del cuerpo
            const { ...data } = req.body
            if (!req.extraVars) req.extraVars = {}
            let error = ''
            let success = ''

            // comprobamos los datos necesarios y se mandan errores
            if (!data) {
                error = 'Debes rellenar los campos'
            } else if (!data.user) {
                error = 'El nombre de usuario es necesario'
            } else if (data.user.length < process.env.LOGIN_LEN) {
                error = 'El nombre de usuario tienes que ser de ' + process.env.LOGIN_LEN + ' o más caracteres'
            } else if (!data.email) {
                error = 'El e-mail es necesario'
            } else if(await User.isUserRegistred(data.user)){
                error = 'El nombre de usuario ya está registrado'
            } else if (await User.isUserRegistred(data.email)) {
                error = 'El e-mail ya está registrado'
            } else if (data.password.length < process.env.PASSWD_LEN) {
                error = 'La contraseña tiene que ser de ' + process.env.PASSWD_LEN + ' o más caracteres'
            } else if (data.password != data.password2) {
                error = 'Las contraseñas no concuerdan'
            } else {
                data.password = await User.setPassword(data.password)
                const user = await User.create(data)
                user.login(req, res, next)
                success = 'Cuenta creada correctamente'
            }
            req.extraVars.error = error
            req.extraVars.success = success
            req.extraVars.register = 1
            req.extraVars.login = data.user
            req.extraVars.email = data.email
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async postUser(req, res, next) {
        try {
            // cogemos variables del cuerpo
            const { ...data } = req.body
            const user = req.user
            if (!req.extraVars) req.extraVars = {}
            let error = ''
            let success = ''

            if (data.deleteToken) {
                const token = user.tokens[data.deleteToken]
                if (token) {
                    await user.removeAuthToken(token).then()
                }
                success = 'Token Eliminado'
            } else if (data.addToken) {
                await user.generateAuthToken()
                success = 'Token Creado'
            } else {
                if (data.password.length == 0 || data.password2.length == 0) {
                    error = 'Rellena las contraseñas'
                } else if (data.password != data.password2) {
                    error = 'Las contraseñas no coinciden'
                } else {
                    await user.updatePassword(data.password)
                    success = 'Contraseña actualizada correctamente'
                }
            }
            req.extraVars.error = error
            req.extraVars.success = success
            next()
        } catch (error) {
            console.error(error)
        }
    },
    // render del formulario
    async renderForm(req, res){
        try {
            const extraVars = req.extraVars
            const title = extraVars && extraVars.register ? 'Regístrate' : 'Inicia Sesión'
            res.render('pages/login', {
                title: title,
                ...extraVars,
            })   
        } catch (error) {
            console.error(error)
        }
    },
    // render del panel de usuario
    async renderPanel(req, res, next){
        try {
            const user = req.user
            const extraVars = req.extraVars
            const permissions = req.permissions
            res.render('pages/user', {
                title: 'Panel de Usuario',
                user: user,
                ...extraVars,
                permissions: {...permissions},
            })
        } catch (error) {
            console.error(error)
        }
    },
    getPostData(req, res, next) {
        if (req.extraVars) {
            next()
        } else {
            const { ...body } = req.body
            if (Object.keys(body).length > 0) {
                req.extraVars = body
            } else {
                const { ...query } = req.query
                req.extraVars = query
            }
            next()
        }
    }
}


module.exports = UserController;