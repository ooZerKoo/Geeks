const jwt = require('express-jwt')
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
        cart: Array
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
    const token = jwt.sign({_id: this._uid}, process.env.KEY)
    console.log(token)
    return this.update({
        $push: {
            tokens: token
        }
    })
}

UserSchema.methods.removeAuthToken = function (token) {
    return this.update({
        $pull: {
            tokens: token
        }
    })
}

UserSchema.statics.findByToken = async function(token) {
    try {
        const find = jwt.verify(token, process.env.KEY)
        return this.findOne({
            _id: find._id,
            tokens: token
        })
    } catch (error) {
        console.error(error);
    }
}

UserSchema.statics.findByCredentials = async function(login, password) {
    try {
        const login = user ? user : email
        const data = await User.findOne({
            $or: [
                {user: login},
                {email: login}
            ]
        }).then(Password.checkPassword(password, data.password))
        return data;
    } catch (error) {
        console.error(error);   
    }
}

UserSchema.statics.checkPassword = async function(password1, password2) {
    try {
        
    } catch (error) {
        console.error(error)
    }
}

const User = mongoose.model('User', UserSchema);

module.exports = User;