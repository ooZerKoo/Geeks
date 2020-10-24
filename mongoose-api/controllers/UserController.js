const User = require('../models/User');
const UserController = {

    async getAll(req, res) {
        try {
            const { email } = req.body;
            const user = await User.find({email: email});
            res.send(user);
        } catch (error) {
            console.error(error);
            res.status(500).send({message:'Internal error', error})
        }
    },
    async register(req, res) {
        try {
            const user = await User.create(req.body);
            res.send({user, message: 'User created successfuly'});
        } catch (error) {
            console.error(error);
            res.status(500).send({message: 'There was a problem trying to register the user', error})
        }
    }
};

module.exports = UserController;