require('./config/mongoose');
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const adminRouter = require('./routes/admin');

const ContextController = require('./controllers/ContextController');
const CartController = require('./controllers/CartController');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(session({
  secret: process.env.KEY,
  name: 'user',
  resave: true,
  saveUninitialized: true
}))



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(ContextController.getContext, ContextController.getPostData, ContextController.getExtraVars, CartController.updateCart)

app.use('/', indexRouter);
app.use(process.env.USER_ROUTE, usersRouter);
app.use(process.env.PRODUCT_ROUTE, productsRouter);
app.use(process.env.CATEGORY_ROUTE, categoriesRouter);
app.use(process.env.ADMIN_ROUTE, adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

module.exports = app;
