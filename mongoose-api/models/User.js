const mongoose = require('mongoose');

const UserShcema = new mongoose.Schema({
    name: String,
    email: {
        unique: true,
        required: [true, 'Email necesario'],
        type: String,
    },
    password: {
        required: true,
        type: String,
        minlength: [8, 'La contraseña tiene que ser mínimo de 8 caracteres']
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'superadmin'],
    }
},
{
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        },
        virtuals: true
    }
});

UserShcema.virtual('role-email').get(function() {
    return this.role + '-' + this.email
})

const User = mongoose.model('User', UserShcema);

module.exports = User;