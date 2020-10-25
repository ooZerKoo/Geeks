const UserController = require('../controllers/UserController')
const CategoryController = require('./CategoryController')

const User = require('../models/User')
const Product = require('../models/Product')
const Category = require('../models/Category')

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
    // renders de admin
    async renderPanel(req, res){
        try {
            const extraVars = req.extraVars
            res.render('admin/home', {...extraVars, title: 'Panel de Administrador'})
        } catch (error) {
            console.error(error)
        }
    },
    async renderOrders(req, res){
        try {
            const extraVars = req.extraVars
            res.render('admin/orders', {...extraVars, title: 'Pedidos'})
        } catch (error) {
            console.error(error)
        }
    },
    async renderProducts(req, res){
        try {
            const extraVars = req.extraVars
            const categories = await Category.getAll()
            const products = await Product.getAll()
            res.render('admin/products', {
                ...extraVars,
                categories: categories,
                products: products,
                title: 'Productos'
            })
        } catch (error) {
            console.error(error)
        }
    },
    async renderCategories(req, res, next){
        try {
            const extraVars = req.extraVars
            const categories = await Category.getAll()
            res.render('admin/categories', {
                ...extraVars,
                categories: categories,
                title: 'Categorías'
            })
        } catch (error) {
            console.error(error)
        }
    },
    async renderCustomers(req, res){
        try {
            const extraVars = req.extraVars
            const customers = await User.getAllCustomers()
            res.render('admin/customers', {
                ...extraVars,
                customers: customers,
                title: 'Clientes'
            })
        } catch (error) {
            console.error(error)
        }
    },
    async renderMenus(req, res, next) {
        try {
            const url = process.env.ADMIN_ROUTE+'/panel/'
            const extraVars = {
                left_menu: [
                    {name: 'Inicio', url: url},
                    {name: 'Clientes', url: url+'customers'},
                    {name: 'Pedidos', url: url+'orders'},
                    {name: 'Categorías', url: url+'categories'},
                    {name: 'Productos', url: url+'products'},
                ]}
            req.extraVars = extraVars
            next()
        } catch (error) {
            console.error(error)
        }
    }
}


module.exports = AdminController;