const User = require('../models/User')

const UserController = {
    async setLogin(req, res, next) {
        try {
            // cogemos login + pswd
            const { login, password } = req.context.post
            const error = []
            const success = []
            // si están vacíos mandamos error
            if (!password || !login) error.push(2)

            user = await User.findByCredentials(login, password)
            if (typeof user != 'object') error.push(user)
            
            req.context.post.error = error
            req.context.post.success = success
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
        req.context.register = 1
        next()
    },
    // post registrarse
    async setRegister(req, res, next) {
        try {
            // cogemos las variables del cuerpo
            const { ...data } = req.body
            const error = []
            const success = []
            // comprobamos los datos necesarios y se mandan errores
            if (!data) error.push(2)
            if (!data.user) error.push(4)
            if (data.user.length < process.env.LOGIN_LEN) error.push(5)
            if (!data.email) error.push(6)
            if (await User.isUserRegistred(data.user)) error.push(7)
            if (await User.isUserRegistred(data.email)) error.push(8)
            if (data.password.length < process.env.PASSWD_LEN) error.push(9)
            if (data.password != data.password2) error.push(3)
            
            if (error.length == 0) {
                data.password = await User.setPassword(data.password)
                const user = await User.create(data)
                user.login(req, res, next)
                success.push(4)
            }
            req.context.post.error = error
            req.context.post.success = success
            req.context.post.login = data.user
            req.context.post.email = data.email
            req.context.register = 1
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async postUser(req, res, next) {
        try {
            // cogemos variables del cuerpo
            const { ...data } = req.body
            const user = data.id ? await User.findById(data.id) : req.context.user
            const error = []
            const success = []

            if (data.deleteToken) {
                const token = user.tokens[data.deleteToken]
                if (token) {
                    await user.removeAuthToken(token)
                    success.push(1)
                }
            } else if (data.addToken) {
                await user.generateAuthToken()
                success.push(2)
            } else {
                if (data.password.length == 0 || data.password2.length == 0) {
                    error.push(1)
                } else if (data.password != data.password2) {
                    error.push(3)
                } else {
                    await user.updatePassword(data.password)
                    success.push(3)
                }
            }
            req.context.post.error = error
            req.context.post.success = success
            next()
        } catch (error) {
            console.error(error)
        }
    },
    // render del formulario
    async renderForm(req, res){
        try {
            const title = req.context && req.context.register ? 'Regístrate' : 'Inicia Sesión'
            res.render('pages/login', {title: title, ...req.context,})
        } catch (error) {
            console.error(error)
        }
    },
    // render del panel de usuario
    async renderPanel(req, res, next){
        try {
            res.render('pages/user', {title: 'Panel de Usuario', ...req.context})
        } catch (error) {
            console.error(error)
        }
    },
    async renderMenu(req) {
        try {
            const base_url = process.env.USER_ROUTE+'/'
            const userMenu = []
            if (req.session && req.session.user) {
                userMenu.push({name: 'Tu cuenta', url: base_url})
            } else {
                userMenu.push({name: 'Inicia Sesión', url: base_url})
            }
            return userMenu
        } catch (error) {
            console.error(error)
        }
    }
}


module.exports = UserController;