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

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id}, process.env.KEY)
    return User.findOneAndUpdate(
        { _id: this._id}, 
        { $push: { tokens: token } },
        {new: true}
    );
}

UserSchema.methods.removeAuthToken = function (token) {
    return User.findOneAndUpdate(
        { _id: this._id}, 
        { $pull: { tokens: token } },
        {new: true}
    );
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
            User.redirectUserPanel(res)
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
            User.redirectUserLogin(res)
        }
    } catch (error) {
        console.error(error)
    }
}

UserSchema.methods.login = function(req, res) {
    req.session.user = this
    User.redirectUserPanel(res)
}

UserSchema.statics.logout = function(req, res) {
    req.session.destroy()
    User.redirectUserLogin(res)
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

const User = mongoose.model('User', UserSchema);

module.exports = User;