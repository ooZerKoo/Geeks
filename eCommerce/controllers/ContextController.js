const CategoryController = require('../controllers/CategoryController')
const UserController = require('../controllers/UserController')
const MessageController = require('../controllers/MessageController')
const AdminController = require('./AdminController')

const ContextController = {
    async getContext(req, res, next) {
        try {
            const path = ContextController.getPath(req)
            if (path) {
                const context = req.context
                if (context) {
                    req.context = { context, ...req.query}
                } else {
                    req.context = { ...req.query }
                }
                const error = req.context.error
                const success = req.context.success
                req.context.post = {}
                req.context.error = []
                req.context.success = []
                req.context.varsUrl = ''

                if(!req.session.cart) req.session.cart = []
                req.context.cart = req.session.cart

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

                req.context.user = await UserController.getLogged(req)
                req.context.leftColumn = await ContextController.getMenus(req, path)
            }
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async getMenus(req, path) {
        try {
            const userMenu = await UserController.renderMenu(req)
            if (path == 'admin') {
                const adminMenu = AdminController.renderMenu()
                return {
                    adminMenu: adminMenu,
                    userMenu: userMenu,
                }
            } else {
                const categoryMenu = await CategoryController.renderMenu(req)
                return {
                    categoryMenu: categoryMenu,
                    userMenu: userMenu,
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    async getPostData(req, res, next) {
        try {
            if (req.context) {
                const { body, query } = req
                const { post } = req.context
                if (post) {
                    req.context.post = { ...post, ...query, ...body }
                } else {
                    req.context.post = { ...query, ...body }
                }
            }
            next()
        } catch (error) {
            console.error(error)
        }
    },
    getPath(req) {
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
    },
    logContext(req, res, next) {
        if(req.context) {
            console.log(req.context)
            console.log(req.session)
        }
        next()
    },
    getExtraVars(req, res, next) {
        const context = req.context
        let varsUrl
        if (context) {
            let vars = []
            let varsFinal = []
            const putVar = ['login', 'error', 'success', 'register', 'admin']
            const post = req.context.post
            if (post) {
                for (i in post) {
                    if (putVar.includes(i) && typeof post[i] != 'undefined' && (post[i].length > 0 || post[i] == 1)) {
                        vars[i] = `${i}=${post[i]}`
                    }
                }
            }
            for (v in vars) {
                varsFinal.push(vars[v])
            }
            if (varsFinal.length > 0) {
                varsUrl = '?' + varsFinal.join('&')
            }
        }
        req.context.varsUrl = varsUrl ? varsUrl : ''
        next()
    }
}

module.exports = ContextController