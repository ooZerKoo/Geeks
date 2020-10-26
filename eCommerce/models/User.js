const bcrypt = require('bcrypt')
const saltRounds = parseInt(process.env.SALT_ROUNDS)
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

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
                delete res.password
                return res
            }
        }
    }
)

UserSchema.virtual('permissions').get(function(){
    const permissions = User.getPermissions(this.role)
    return permissions;
})

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
            return 10
        }
        const check = await User.checkPassword(password, user.password)
        if (!check) {
            return 11
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

UserSchema.statics.isLoggedUser = function(req, res, next) {
    const logged = req.session.user
    if (logged) {
        next()
    } else {
        User.goLogin(req, res, next)
    }
}

UserSchema.statics.isNotLoggedAdmin = async function(req, res, next) {
    try {
        const logged = req.session.user
        if (!logged) {
            next()
        } else {
            if (logged.role == 'admin') {
                User.goPanel(req, res)
            } else {
                req.context.post.error = [30]
                next()
            }
        }
    } catch (error) {
        console.error(error)
    }
}

UserSchema.statics.isLoggedAdmin = async function(req, res, next) {
    try {
        const logged = req.session.user
        if (logged) {
            if (logged.role != 'admin') {
                req.context.post.error = [30]
                User.goLogin(req, res, next)
            } else {
                next()
            }
        } else {
            User.goLogin(req, res, next)
        }
    } catch (error) {
        console.error(error)
    }
}

UserSchema.methods.login = function(req, res, next) {
    req.session.user = this
    next()
}

UserSchema.statics.goLogin = function(req, res, next) {
    const baseUrl = req.baseUrl.split('/')
    const register = req.context.register ? req.context.register : null
    switch ('/'+baseUrl[1]) {
        case process.env.ADMIN_ROUTE:
            User.redirectAdminLogin(req, res, next)
            break
        case process.env.USER_ROUTE:
            if (register) {
                User.redirectUserRegister(req, res, next)
            } else {
                User.redirectUserLogin(req, res, next)
            }
            break
        default:
            if (register) {
                User.redirectUserRegister(req, res, next)
            } else {
                User.redirectUserLogin(req, res, next)
            }
            break
    }
}

UserSchema.statics.goPanel = function(req, res, next) {
    const baseUrl = req.baseUrl.split('/')
    switch ('/'+baseUrl[1]) {
        default:
        case process.env.USER_ROUTE:
            User.redirectUserPanel(req, res, next)
            break
        case process.env.ADMIN_ROUTE:
            User.redirectAdminPanel(req, res, next)
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
        const id = req.session && req.session.user ? req.session.user._id : false
        return id ? await User.findById(id) : null
    } catch (error) {
        console.error(error)
    }
}

UserSchema.methods.updatePassword = async function(password) {
    const newPassword = await User.setPassword(password)
    return await User.findByIdAndUpdate(
        this._id,
        {password: newPassword},
        {new: true}
    )
}

UserSchema.statics.redirectUserPanel = function (req, res, next) {
    const varsText = User.getExtraVars(req, false)
    res.redirect('/user/panel' + varsText)
}

UserSchema.statics.redirectUserLogin = function (req, res, next) {
    const varsText = User.getExtraVars(req)
    res.redirect('/user' + varsText)
}

UserSchema.statics.redirectUserRegister = function (req, res, next) {
    const varsText = User.getExtraVars(req)
    res.redirect('/user/register' + varsText)
}

UserSchema.statics.redirectAdminPanel = function (req, res, next) {
    const varsText = User.getExtraVars(req, false)
    res.redirect('/admin/panel' + varsText)
}

UserSchema.statics.redirectAdminLogin = function (req, res, next) {
    const varsText = User.getExtraVars(req)
    res.redirect('/admin' + varsText)
}

UserSchema.statics.getExtraVars = function (req, full = true) {
    let vars = []
    let varsFinal = []
    let varsText = ''
    const dontPutVar = ['password', 'password2', 'leftColumn', 'post', 'user']
    if (!full) {
        dontPutVar.push('login')
    }
    const post = req.context.post
    if (post) {
        for (i in post) {
            if (!dontPutVar.includes(i) && typeof post[i] != 'undefined' && post[i].length > 0) {
                vars[i] = `${i}=${post[i]}`
            }
        }
    }
    for (v in vars) {
        varsFinal.push(vars[v])
    }
    if (varsFinal.length > 0) {
        varsText = '?' + varsFinal.join('&')
    }
    return varsText
}

UserSchema.statics.getPermissions = function (role) {
    switch (role) {
        default:
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
    }
}

UserSchema.statics.setPassword = (password) => {
    return bcrypt.hash(password, saltRounds)
}

UserSchema.statics.checkPassword = (password, passwordDB) => {
    return bcrypt.compare(password, passwordDB)
}

UserSchema.statics.getAll = async function() {
    try {
        const users = await User.find()
        return users
    } catch (error) {
        console.error(error)
    }
}

UserSchema.statics.getAllCustomers = async function() {
    try {
        const users = await User.find({role: 'customer'})
        return users
    } catch (error) {
        console.error(error)
    }
}

UserSchema.statics.getAllAdmins = async function() {
    try {
        const users = await User.find({role: 'admin'})
        return users
    } catch (error) {
        console.error(error)
    }
}

UserSchema.statics.getAllEmployees = async function() {
    try {
        const users = await User.find({role: 'employee'})
        return users
    } catch (error) {
        console.error(error)
    }
}

UserSchema.statics.getAllEditors = async function() {
    try {
        const users = await User.find({role: 'editor'})
        return users
    } catch (error) {
        console.error(error)
    }
}

const User = mongoose.model('User', UserSchema);

module.exports = User;