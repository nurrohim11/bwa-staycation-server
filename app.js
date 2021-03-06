var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverrid = require('method-override')
// express session
const session = require('express-session')
// mongooses
const mongoose = require('mongoose')
// connect flash
const flash = require('connect-flash');
// connect ke mongodb
mongoose.connect('mongodb+srv://alkhattabi:XcLhUQyP_3m-@s3@cluster0.aqobu.mongodb.net/db_staycation?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// router admin
const adminRouter = require('./routes/admin')
// router api
const apiRouter = require('./routes/api')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// use express session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:Date.now() + (30 * 86400 * 1000) }
}))
// app.use(express.session({ 
//   secret: "secret", 
//   store: new MemoryStore(), 
//   maxAge: Date.now() + (30 * 86400 * 1000) 
// }));

// use connect flash
app.use(flash())
// use metho override
app.use(methodOverrid('_method'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// load assets sb-admin-2
app.use('/sb-admin-2',express.static(path.join(__dirname,'node_modules/startbootstrap-sb-admin-2')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// admin
app.use('/admin',adminRouter)
// api
app.use('/api/v2',apiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
