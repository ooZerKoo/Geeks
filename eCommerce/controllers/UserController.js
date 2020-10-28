const bcrypt = require('bcrypt')
const saltRounds = parseInt(process.env.SALT_ROUNDS)
const User = require('../models/User')
const ContextController = require('./ContextController')

const UserController = {
    async setLogin(req, res, next) {
        try {
            // cogemos login + pswd
            const { submitLogin } = req.body
            if (submitLogin) {
                const { login, password } = req.context.post
                if (typeof login != 'undefined' && typeof password != 'undefined') {
                    const error = []
                    const success = []
                    // si están vacíos mandamos error
                    if (!password || !login) error.push(1002)
                    
                    user = await UserController.findByCredentials(login, password)
                    if (typeof user != 'object') error.push(user)
                    
                    req.context.post.error = error
                    req.context.post.success = success
                    if (typeof user == 'object') {
                        user.login(req, res, next)
                    }
                }
            }
            next()
        } catch (error) {
            console.error(error)
        }
    },
    renderRegister(req, res, next) {
        if (req.context) {
            if (!req.context.post) req.context.post = {}
        }
        req.context.post.register = 1
        next()
    },
    // post registrarse
    async setRegister(req, res, next) {
        try {
            // cogemos las variables del cuerpo
            const { submitRegister } = req.body
            if (submitRegister) {
                const data = req.context.post
                const error = []
                const success = []
                // comprobamos los datos necesarios y se mandan errores
                if (!data) {
                    error.push(1002)
                } else {
                    if (!data.user) {
                        error.push(1004)
                    } else if (data.user.length < process.env.LOGIN_LEN) {
                        error.push(1005)
                    }
                    if (!data.email) {
                        error.push(1006)
                    }
                    // miramos si el email o usuario están registrados
                    if (await UserController.isUserRegistred(data.user)) error.push(1007)
                    if (await UserController.isUserRegistred(data.email)) error.push(1008)
                    // comprobamos que las contraseñas sean iguales y que tengan el largo acordado
                    if (data.password && data.password2) {
                        if (data.password.length < process.env.PASSWD_LEN) error.push(1009)
                        if (data.password != data.password2) error.push(1003)
                    } else {
                        error.push(1002)
                    }
                }
                req.context.post.error = error
                req.context.post.success = success
                req.context.post.login = data.user
                req.context.post.email = data.email
                req.context.post.register = 1
                // si no hay errores, creamos el usuario
                if (error.length == 0) {
                    success.push(1004)
                    req.context.post.success = success
                    data.password = await UserController.setPassword(data.password)
                    const user = await User.create(data)
                    user.generateAuthToken()
                    user.login(req, res, next)
                }
            }
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async postUser(req, res, next) {
        try {
            // cogemos variables del cuerpo
            const { ...data } = req.body
            if (data) {
                const user = data.id ? await User.findById(data.id) : req.context.user
                const error = []
                const success = []
                if (data.deleteToken) {
                    const token = user.tokens[data.deleteToken]
                    if (token) {
                        await user.removeAuthToken(token)
                        success.push(1001)
                    }
                } else if (data.addToken) {
                    await user.generateAuthToken()
                    success.push(1002)
                } else {
                    if (data.password && data.password2) {
                        if (data.password.length == 0 || data.password && data.password2.length == 0) {
                            error.push(1001)
                        } else if (data.password != data.password2) {
                            error.push(1003)
                        } else {
                            const password = await UserController.setPassword(data.password)
                            await user.updatePassword(password)
                            success.push(1003)
                        }
                    } else {
                        next()
                    }
                }
                req.context.post.error = error
                req.context.post.success = success
            }
            next()
        } catch (error) {
            console.error(error)
        }
    },
    // render del formulario
    async renderForm(req, res){
        try {
            const title = req.context.post.register ? 'Regístrate' : 'Inicia Sesión'
            res.render('pages/login', {title: title, ...req.context})
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
            const base_url = process.env.USER_ROUTE + '/'
            const userMenu = []
            if (req.session && req.session.user) {
                userMenu.push({name: 'Tu cuenta', url: base_url})
                if (req.session.user.role == 'admin') {
                    userMenu.push({name: 'Admin', url: process.env.ADMIN_ROUTE + '/panel'})
                }
                userMenu.push({name: 'Salir', url: base_url + 'logout'})
            } else {
                userMenu.push({name: 'Inicia Sesión', url: base_url})
            }
            return userMenu
        } catch (error) {
            console.error(error)
        }
    },
    async isNotLoggedUser(req, res, next) {
        try {
            const logged = req.session.user
            if (!logged) {
                next()
            } else {
                UserController.goPanel(req, res)
            }
        } catch (error) {
            console.error(error)
        }
    },
    async isNotLoggedAdmin(req, res, next) {
        try {
            const logged = req.session.user
            if (!logged) {
                next()
            } else {
                if (logged.role == 'admin') {
                    req.context.post.error = [1030]
                    UserController.goPanel(req, res)
                } else {
                    next()
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    async isLoggedAdmin(req, res, next) {
        try {
            const logged = req.session.user
            if (logged) {
                if (logged.role == 'admin') {
                    next()
                } else {
                    req.context.post.error = [1030]
                    UserController.goLogin(req, res, next)
                }
            } else {
                req.context.post.error = [1012]
                UserController.goLogin(req, res, next)
            }
        } catch (error) {
            console.error(error)
        }
    },
    isLoggedUser(req, res, next) {
        const logged = req.session.user
        if (logged) {
            next()
        } else {
            UserController.goLogin(req, res, next)
        }
    },
    goPanel(req, res, next) {
        const baseUrl = req.baseUrl.split('/')
        const user = req.session.user
        switch ('/'+baseUrl[1]) {
            default:
            case process.env.USER_ROUTE:
                if (user) {
                    if (req.context.post.resgister) {
                        req.context.post.error = []
                    }
                    UserController.redirectUserPanel(req, res, next)
                } else {
                    if (req.context.post.register) {
                        UserController.redirectUserRegister(req, res, next)
                    } else {
                        UserController.redirectUserLogin(req, res, next)
                    }
                }
                break
            case process.env.ADMIN_ROUTE:
                if (user) {
                    UserController.redirectAdminPanel(req, res, next)
                } else {
                    UserController.redirectAdminLogin(req, res, next)
                }
                break
        }
    },
    goLogin(req, res, next) {
        const baseUrl = req.baseUrl.split('/')
        const register = req.context.post.register ? req.context.post.register : null
        switch ('/'+baseUrl[1]) {
            default:
            case process.env.USER_ROUTE:
                if (register) {
                    UserController.redirectUserRegister(req, res, next)
                } else {
                    UserController.redirectUserLogin(req, res, next)
                }
                break
            case process.env.ADMIN_ROUTE:
                UserController.redirectAdminLogin(req, res, next)
                break
        }
    },
    logout(req, res) {
        req.session.destroy()
        UserController.goLogin(req, res)
    },
    async updateCart(req, res, next) {
        try {
            if (req.session.user) {
                const user = await User.findById(req.session.user._id)
                const cartUser = user.cart
                const cartSession = req.session.cart
                for (c in cartSession) {
                    cartUser.push(cartSession[c])
                }
                user.updateOne({cart: cartUser})
                req.session.cart = cartUser
            }
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async isUserRegistred (login) {
        try {
            const user = await User.findOne({
                $or: [
                    {user: login},
                    {email: login}
                ]
            })
            return user ? true : false
        } catch (error) {
            console.error(error)
        }
    },
    async getLogged(req) {
        try {
            const id = req.session && req.session.user ? req.session.user._id : false
            return id ? await User.findById(id) : null
        } catch (error) {
            console.error(error)
        }
    },
    redirectUserPanel(req, res, next) {
        const url = req.context.varsUrl
        res.redirect(process.env.USER_ROUTE + '/panel' + url)
    },
    redirectUserLogin(req, res, next) {
        const url = req.context.varsUrl
        res.redirect('/user' + url)
    },
    redirectUserRegister(req, res, next) {
        const url = req.context.varsUrl
        res.redirect(process.env.USER_ROUTE + '/register' + url)
    },
    redirectAdminPanel(req, res, next) {
        const url = req.context.varsUrl
        res.redirect(process.env.ADMIN_ROUTE + '/panel' + url)
    },
    redirectAdminLogin(req, res, next) {
        const url = req.context.varsUrl
        res.redirect(process.env.ADMIN_ROUTE + url)
    },
    setPassword(password) {
        return bcrypt.hash(password, saltRounds)
    },
    async checkPassword(password, passwordDB){
        return await bcrypt.compare(password, passwordDB)
    },
    async getAll(){
        try {
            const users = await User.find()
            return users
        } catch (error) {
            console.error(error)
        }
    },
    async getAllCustomers() {
        try {
            const users = await User.find({role: 'customer'})
            return users
        } catch (error) {
            console.error(error)
        }
    },
    async getAllAdmins() {
        try {
            const users = await User.find({role: 'admin'})
            return users
        } catch (error) {
            console.error(error)
        }
    },
    async getAllEmployees() {
        try {
            const users = await User.find({role: 'employee'})
            return users
        } catch (error) {
            console.error(error)
        }
    },
    async getAllEditors() {
        try {
            const users = await User.find({role: 'editor'})
            return users
        } catch (error) {
            console.error(error)
        }
    },
    async findByCredentials(login, password) {
        try {
            const user = await User.findOne({
                $or: [
                    {user: login},
                    {email: login}
                ]
            })
            if (!user) {
                return 1010
            }
            const check = await UserController.checkPassword(password, user.password)
            if (!check) {
                return 1011
            }
            return user
        } catch (error) {
            console.error(error);   
        }
    },
    async findByToken(token) {
        try {
            const find = jwt.verify(token, process.env.KEY)
            return User.findOne({
                _id: find._id,
                tokens: token
            })
        } catch (error) {
            console.error(error);
        }
    }
}


module.exports = UserController;