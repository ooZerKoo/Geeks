const CategoryController = require('../controllers/CategoryController')
const UserController = require('../controllers/UserController')
const MessageController = require('../controllers/MessageController')

const User = require('../models/User')
const AdminController = require('./AdminController')

const ContextController = {
    async getContext(req, res, next) {
        try {
            const path = await ContextController.getPath(req)
            if (path) {
                req.context = { ...req.query }
                const error = req.context.error
                const success = req.context.success
                req.context.post = {}
                req.context.error = []
                req.context.success = []

                if (error && !Array.isArray(error)) {
                    const errorArray = error.split(',')
                    for (i in errorArray) {
                        req.context.error.push(MessageController.getError(errorArray[i]))
                    }
                }

                if (success && !Array.isArray(success)) {
                    const successArray = success.split(',')
                    for (i in successArray) {
                        req.context.success.push(MessageController.getSuccess(successArray[i]))
                    }
                }
                req.context.user = await User.getLogged(req)
                req.context.leftColumn = await ContextController.getMenus(req, path)
            }
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async getMenus(req, path) {
        try {
            if (path == 'admin') {
                const adminMenu = AdminController.renderMenu()
                return {adminMenu: adminMenu}
            } else {
                const categoryMenu = await CategoryController.renderMenu(req)
                const userMenu = await UserController.renderMenu(req)
                return {
                    categoryMenu: categoryMenu,
                    userMenu: userMenu
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    async getPostData(req, res, next) {
        try {
            const { body, query } = req
            req.context.post = { ...body, ...query }
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async getPath(req) {
        try {
            const p = req.path.split('/')
            const page = '/' + (p[1] ? p[1] : '')
            switch (page) {
                case '/':
                    return 'home'
                case process.env.USER_ROUTE:
                    return 'user'
                case process.env.ADMIN_ROUTE:
                    return 'admin'
                case process.env.PRODUCT_ROUTE:
                    return 'product'
                case process.env.CATEGORY_ROUTE:
                    return 'category'
                default:
                    return false
            }
        } catch (error) {
            console.error(error)
        }
    },
    logContext(req, res, next) {
        if (req.context) console.log(req.context)
        next()
    }
}

module.exports = ContextController