const UserController = require('../controllers/UserController')

const User = require('../models/User')
const Product = require('../models/Product')
const Category = require('../models/Category')

const AdminController = {
    async setLogin(req, res, next) {
        try {
            // cogemos login + pswd
            const { login, password } = req.body
            let error = ''
            let success = ''
            // si están vacíos mandamos error
            if (!password || !login) {
                error = 'Rellena los campos necesarios'
            } else {
                user = await User.findByCredentials(login, password)
                if (typeof user != 'object') {
                    error = user
                } else {
                    if (user.role != 'admin')
                    error = 'No tienes permisos para entrar'
                }
            }
            req.extraVars.error = error
            req.extraVars.success = success
            req.extraVars.login = login
            if (typeof user == 'object') {
                user.login(req, res, next)
            } else {
                next()
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
            const url = process.env.ADMIN_ROUTE+'/'
            const url_panel = url+'panel/'
            const extraVars = {
                left_menu: [
                    {name: 'Inicio', url: url_panel},
                    {name: 'Clientes', url: url_panel+'customers'},
                    {name: 'Pedidos', url: url_panel+'orders'},
                    {name: 'Categorías', url: url_panel+'categories'},
                    {name: 'Productos', url: url_panel+'products'},
                    {name: 'Salir', url: url+'logout'},
                ]}
            req.extraVars = extraVars
            next()
        } catch (error) {
            console.error(error)
        }
    }
}


module.exports = AdminController;