const User = require('../models/User')
const Product = require('../models/Product')
const UserController = require('../controllers/UserController')

const AdminController = {
    async setLogin(req, res) {
        try {
            // cogemos login + pswd
            const { login, password } = req.body
            // si están vacíos mandamos error
            if (!password || !login) {
                const error = 'Rellena los campos necesarios'
                UserController.renderForm(req, res, null, {login: login, error: error})
            } else {
                // buscamos un ususario con esos datos
                const user = await User.findByCredentials(login, password)
                if (typeof user != 'object') {
                    // si no lo encuentra mandamo error
                    UserController.renderForm(req, res, null, {login: login, error : user})
                } else if (user.role != 'admin'){
                    UserController.renderForm(req, res, null, {login: login, error : 'No tienes permisos para entrar'})
                } else {
                    user.login(req, res)
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    // render del panel de usuario
    async renderPanel(req, res){
        try {
            const adminVars = req.admin_vars
            res.render('admin/home', {...adminVars})
        } catch (error) {
            console.error(error)
        }
    },

    async renderOrders(req, res){
        try {
            const adminVars = req.admin_vars
            res.render('admin/orders', {...adminVars, title: 'Pedidos'})
        } catch (error) {
            console.error(error)
        }
    },
    async renderProducts(req, res){
        try {
            const adminVars = req.admin_vars
            res.render('admin/products', {...adminVars, title: 'Productos'})
        } catch (error) {
            console.error(error)
        }
    },
    async renderCategories(req, res){
        try {
            const adminVars = req.admin_vars
            res.render('admin/categories', {...adminVars, title: 'Categorías'})
        } catch (error) {
            console.error(error)
        }
    },
    async renderCustomers(req, res){
        try {
            const adminVars = req.admin_vars
            res.render('admin/categories', {...adminVars, title: 'Clientes'})
        } catch (error) {
            console.error(error)
        }
    },
    async renderMenus(req, res, next) {
        try {
            const url = process.env.ADMIN_ROUTE+'/panel/'
            const adminVars = {
                left_menu: [
                    {name: 'Inicio', url: url},
                    {name: 'Clientes', url: url+'customers'},
                    {name: 'Pedidos', url: url+'orders'},
                    {name: 'Categorías', url: url+'categories'},
                    {name: 'Productos', url: url+'products'},
                ],
                title: 'Panel de Administrador'}
            req.admin_vars = adminVars
            next()
        } catch (error) {
            console.error(error)
        }
    }
}


module.exports = AdminController;