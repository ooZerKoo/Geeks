const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Password = require('../models/Password')

const UserSchema = mongoose.Schema(
    {
        password: {
            type: String,
            required: [true, 'Email necesario'],
        },
        email: {
            type: String,
            required: [true, 'Email necesario'],
            unique: [true, 'Este email ya está registrado'],
        },
        user: {
            type: String,
            required: [true, 'Usuario necesario'],
            unique: [true, 'Este usuario ya está cogido'],
        },
        name: String,
        birthday: Date,
        role: {
            type: String,
            default: 'customer',
            enum: ['customer', 'employee', 'admin', 'editor']
        },
        cart: Array,
        tokens: Array
    },
    {
        toJSON: {
            transform: function(req, res){
             //   delete res.role
                delete res.password
                return res
            }
        }
    }
)

UserSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({_id: this._id}, process.env.KEY)
        const user = await this.updateOne(
            { $push: { tokens: token } }
        )
        return user
    } catch (error) {
        console.error(error)
    }
}

UserSchema.methods.removeAuthToken = async function (token) {
    try {
        const user = await this.updateOne(
            { $pull: { tokens: token } }
        )
        return user
    } catch (error) {
        console.error(error)
    }
}

UserSchema.statics.findByToken = async function(token) {
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

UserSchema.statics.findByCredentials = async function(login, password) {
    try {
        const user = await User.findOne({
            $or: [
                {user: login},
                {email: login}
            ]
        })
        if (!user) {
            return 'Usuario no encontrado'
        }
        const check = await Password.checkPassword(password, user.password)
        if (!check) {
            return 'Contraseña Incorrecta'
        }
        return user
    } catch (error) {
        console.error(error);   
    }
}

UserSchema.statics.isNotLoggedUser = async function(req, res, next) {
    try {
        const logged = req.session.user
        if (!logged) {
            next()
        } else {
            User.goPanel(req, res)
        }
    } catch (error) {
        console.error(error)
    }
}

UserSchema.statics.isLoggedUser = async function(req, res, next) {
    try {
        const logged = req.session.user
        if (logged) {
            next()
        } else {
            User.goLogin(req, res)
        }
    } catch (error) {
        console.error(error)
    }
}

UserSchema.statics.isNotLoggedAdmin = async function(req, res, next) {
    try {
        const logged = req.session.user
        if (!logged || logged.role != 'admin') {
            next()
        } else {
            User.goPanel(req, res)
        }
    } catch (error) {
        console.error(error)
    }
}

UserSchema.statics.isLoggedAdmin = async function(req, res, next) {
    try {
        const logged = req.session.user
        if (logged && logged.role == 'admin') {
            next()
        } else {
            User.goLogin(req, res)
        }
    } catch (error) {
        console.error(error)
    }
}

UserSchema.methods.login = function(req, res) {
    req.session.user = this
    User.goPanel(req, res)
}

UserSchema.statics.goLogin = function(req, res) {
    const baseUrl = req.baseUrl.split('/')
    switch ('/'+baseUrl[1]) {
        case process.env.ADMIN_ROUTE:
            User.redirectAdminLogin(res)
            break
        case process.env.USER_ROUTE:
            User.redirectUserLogin(res)
            break
        default:
            User.redirectUserLogin(res)
            break
    }
}

UserSchema.statics.goPanel = function(req, res) {
    const baseUrl = req.baseUrl.split('/')
    switch ('/'+baseUrl[1]) {
        case process.env.ADMIN_ROUTE:
            User.redirectAdminPanel(res)
            break
            case process.env.USER_ROUTE:
            User.redirectUserPanel(res)
            break
        default:
            User.redirectUserPanel(res)
            break
    }
}

UserSchema.statics.logout = function(req, res) {
    req.session.destroy()
    User.goLogin(req, res)
}

UserSchema.statics.isUserRegistred = async function (login) {
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
}

UserSchema.statics.getLogged = async function (req) {
    try {
        const id = req.session.user._id
        const user = await User.findById(id)
        return user
    } catch (error) {
        
    }
}

UserSchema.statics.redirectUserPanel = function (res) {
    res.redirect('/user/panel')
}

UserSchema.statics.redirectUserLogin = function (res) {
    res.redirect('/user')
}

UserSchema.statics.redirectAdminPanel = function (res) {
    res.redirect('/admin/panel')
}

UserSchema.statics.redirectAdminLogin = function (res) {
    res.redirect('/admin')
}

UserSchema.methods.getUserPermissions = async function () {
    try {
        switch (this.role) {
            case 'customer':
                const customer = {
                    products: ['get'],
                    invoices: ['get'],
                }
                return customer
            case 'admin':
                let admin = {
                    products: ['get', 'post', 'put', 'delete'],
                    invoices: ['get', 'post', 'put', 'delete']
                }
                return admin
            default:
                let def = {
                    products: ['get'],
                    invoices: ['get'],
                }
                return def
        }
    } catch (error) {
        console.error(error)
    }
}

const User = mongoose.model('User', UserSchema);

module.exports = User;