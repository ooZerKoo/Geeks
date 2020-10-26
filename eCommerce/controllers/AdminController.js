const UserController = require('../controllers/UserController')

const User = require('../models/User')
const Product = require('../models/Product')
const Category = require('../models/Category')

const AdminController = {
    async setLogin(req, res, next) {
        try {
            const { login, password } = req.body
            const error = []
            const success = []
            if (!password || !login) {
                error.push(2)
            } else {
                user = await UserController.findByCredentials(login, password)
                if (typeof user != 'object') {
                    error.push(user)
                } else {
                    if (user.role != 'admin')
                    error.push(30)
                }
            }
            req.context.post.error = error
            req.context.post.success = success
            req.context.post.login = login
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
            res.render('admin/home', {...req.context, title: 'Panel de Administrador'})
        } catch (error) {
            console.error(error)
        }
    },
    async renderOrders(req, res){
        try {
            res.render('admin/orders', {...req.context, title: 'Pedidos'})
        } catch (error) {
            console.error(error)
        }
    },
    async renderProducts(req, res){
        try {
            req.context.categories = await Category.find()
            req.context.products = await Product.find()
            res.render('admin/products', {...req.context, title: 'Productos'})
        } catch (error) {
            console.error(error)
        }
    },
    async renderCategories(req, res, next){
        try {
            req.context.categories = await Category.find()
            res.render('admin/categories', {...req.context, title: 'Categorías'})
        } catch (error) {
            console.error(error)
        }
    },
    async renderCustomers(req, res){
        try {
            req.context.customers = await UserController.getAllCustomers()
            res.render('admin/customers', {...req.context, title: 'Clientes'})
        } catch (error) {
            console.error(error)
        }
    },
    renderMenu() {
        const url = process.env.ADMIN_ROUTE+'/'
        const url_panel = url+'panel/'
        const left_menu = [
            {name: 'Inicio', url: url_panel},
            {name: 'Clientes', url: url_panel+'customers'},
            {name: 'Pedidos', url: url_panel+'orders'},
            {name: 'Categorías', url: url_panel+'categories'},
            {name: 'Productos', url: url_panel+'products'},
            {name: 'Salir', url: url+'logout'},
        ]
        return left_menu
    }
}


module.exports = AdminController;