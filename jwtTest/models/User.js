const mongoose = require('mongoose')
const jwt = require('express-jwt')

const UserSchema = mongoose.Schema(
    {
        username: String,
        password: String,
        email: String,
    }
)

UserSchema.statics.generateAuthToken = async function () {
    const token = await jwt.sign({_id: this.id}, 'secretKey')
    return this.update({
        $push: {
            tokens: token
        }
    })
}

UserSchema.statics.removeAuthToken = function (token) {
    return this.update({
        $pull: {
            tokens: token
        }
    })
}

UserSchema.statics.findByToken = function(token) {
    try {
        const verify = await jwt.verify(token, 'secretKey')
        return User.findOne({
            _id: verify._id,
            tokens: token
        })

    } catch (error) {
        console.error(error)
    }
}

const User = mongoose.model('User', UserSchema)

module.exports = User;