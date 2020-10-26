const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const UserController = require('../controllers/UserController')

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
    switch (this.role) {
        default:
        case 'customer':
            return {
                products: ['get'],
                invoices: ['get'],
            }
        case 'admin':
            return {
                products: ['get', 'post', 'put', 'delete'],
                invoices: ['get', 'post', 'put', 'delete']
            }
    }
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

UserSchema.methods.login = function(req, res, next) {
    req.session.user = { _id: this._id, role: this.role}
    next()
}

UserSchema.methods.updatePassword = async function(password) {
    const newPassword = await UserController.setPassword(password)
    return await User.findByIdAndUpdate(
        this._id,
        {password: newPassword},
        {new: true}
    )
}

const User = mongoose.model('User', UserSchema);

module.exports = User;