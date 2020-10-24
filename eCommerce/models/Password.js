const bcrypt = require('bcrypt')
const saltRounds = 9

const Password = {}

Password.setPassword = (password) => {
    return bcrypt.hash(password, saltRounds)
}

Password.checkPassword = (password, passwordDB) => {
    return bcrypt.compare(password, passwordDB)
}

module.exports = Password