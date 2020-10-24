const User = require('../models/User')
const Password = require('../models/Password')

const UserController = {
    // get /user
    async getUser(req, res) {
        try {
            // si está loggeado mostramos su panel de usuario
            if (UserController.isLogged(req)) {
                UserController.renderUser(req, res)
            } else {
                // si no redireccionamos al login
                UserController.redirectLogin(res)
            }
        } catch (error) {
            console.error(error)
        }
    },
    // get /login
    getLogin(req, res) {
        if(UserController.isLogged(req)) {
            // si está loggeado lo mandamos a su panel de usuario
            UserController.redirectUser(res)
        } else {
            // si no redireccionamos al login
            UserController.renderForm(res)
        }
    },
    getRegister(req, res) {
        // si está loggeado lo mandamos a su panel de usuario
        if (UserController.isLogged(req)) {
            UserController.redirectUser(res)
        } else {
            // si no redireccionamos al register
            UserController.renderForm(res, null, null, true)
        }
    },
    async setLogin(req, res) {
        try {
            // si está loggeado lo mandamos a su panel de usuario
            if (UserController.isLogged(req)) {
                UserController.redirectUser(res)
            } else {
                // cogemos login + pswd
                const { login, password } = req.body
                // si están vacíos mandamos error
                if (!password || !login) {
                    const error = 'Rellena los campos necesarios'
                    UserController.renderForm(res, {login: login}, error)
                } else {
                    // buscamos un ususario con esos datos
                    const data = await UserController.findByLogin(login)
                    if (!data) {
                        // si no lo encuentra mandamo error
                        const error = 'No hemos encontrado ningún usuario con este e-mail o nombre de usuario'
                        UserController.renderForm(res, {login: login}, error)
                    } else {
                        // comprobamos que la contraseña esté bien
                        let check = await Password.checkPassword(password, data.password)
                        if (check) {
                            // creamos la sesión
                            await UserController.loginUser(req, data)
                            // lo mandamos a su panel de usuario
                            UserController.redirectUser(res)
                        } else {
                            // pswd incorrecto le mandamo error
                            const error = 'Contraseña incorrecta'
                            UserController.renderForm(res, data, error)
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    // post registrarse
    async setRegister(req, res) {
        try {
            // si está loggeado lo mandamos a su panel de usuario
            if (UserController.isLogged(req)) {
                UserController.redirectUser(res)
            } else {
                // cogemos las variables del cuerpo
                const { ...data } = req.body
                // comprobamos los datos necesarios y se mandan errores
                if (!data.user) {
                    UserController.renderForm(res, 'El nombre de usuario es necesario', true)
                } else if (!data.email) {
                    UserController.renderForm(res, data, 'El e-mail es necesario', true)
                } else if(await UserController.isUserRegistred(data.user)){
                    UserController.renderForm(res, data, 'El nombre de usuario ya está registrado', true)
                } else if (await UserController.isUserRegistred(null, data.email)) {
                    UserController.renderForm(res, data, 'El e-mail ya está registrado', true)
                } else if (data.password != data.password2) {
                    UserController.renderForm(res, data, 'Las contraseñas no concuerdan', true)
                } else {
                    data.password = await Password.setPassword(data.password)
                    // insertamos a la BBDD + creamos la sesión + redireccionamos a su panel de usuario
                    User.create(data)
                        .then(User.generateAuthToken)
                        .then(UserController.redirectUser(res))
                        .catch(e => console.error(e))
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    async logout(req, res) {
        try {
            // eliminamos la sesión
            await UserController.logoutUser(req)
            // redireccionamos a login
            UserController.redirectLogin(res)
        } catch (error) {
            console.error(error)
        }
    },
    async updatePassword(req, res) {
        try {
            // si no está loggeado lo mandamos al login
            if (!UserController.isLogged(req)) {
                UserController.redirectLogin(res)
            } else {
                // cogemos variables del cuerpo
                const { ...data } = req.body
                // comprobamos que las 2 pswd son iguales y mandamos errores
                if (data.password.length == 0 || data.password2.length == 0) {
                    UserController.renderUser(req, res, 'Rellena las contraseñas')
                } else if (data.password != data.password2) {
                    UserController.renderUser(req, res, 'Las contraseñas no coinciden')
                } else {
                    // encriptamos pasword y lo guardamos
                    const newPassword = await Password.setPassword(data.password)
                    const loggedUser = await UserController.getLoggedUser(req)
                    const user = await User.findByIdAndUpdate(
                        loggedUser._id,
                        {password: newPassword},
                        {new: true}
                    )
                    UserController.renderUser(req, res)
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    // redireccionamiento al panel del usuario
    redirectUser(res){
        res.redirect('/user')
    },
    // redireccionamiento al formulario de login
    redirectLogin(res){
        res.redirect('/login')
    },
    // devuelve (bool) de si está loggeado
    isLogged(req) {
        return req.session && req.session.user ? true : false
    },
    // devuelve (bool) de si es admin
    isAdmin(req) {
        return req.session.user.role == 'admin' ? true : false
    },
    // devuelve (bool) de si está registrado
    async isUserRegistred(user, email = null){
        const check = await UserController.findByLogin(user, email)
        return check !== null
    },
    async findByLogin(user, email = null){
        try {
            const login = user ? user : email
            const data = await User.findOne({
                $or: [
                    {user: login},
                    {email: login}
                ]
            })
            return data;
        } catch (error) {
            console.error(error);   
        }
    },
    // crea la sesión
    loginUser(req, user){
        return req.session.user = user
    },
    // destruye la sesión
    logoutUser(req){
        return req.session.destroy()
    },
    // coge el usuario de la sesión
    getLoggedUser(req){
        return req.session.user
    },
    // render del formulario
    renderForm(res, data, error = null, register = null, admin = null){
        const title = (register ? 'Regístrate' : 'Inicia Sesión') + (admin ? 'como Administrador' : '')
        res.render('login', {
            title: title,
            error: error,
            register: register,
            data : data,
            admin: admin,
        })
    },
    // render del panel de usuario
    renderUser(req, res, error = null){
        res.render('user', {
            title: 'Panel de Usuario',
            user: UserController.getLoggedUser(req, res),
            error: error
        })
    }
}


module.exports = UserController;