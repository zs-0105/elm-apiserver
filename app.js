var createError = require('http-errors');
var db = require('./mongodb/db.js');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mount = require('mount-routes')
var cors = require('cors')
const config = require('config-lite')(__dirname);

var session = require('express-session')

var Statistic = require('./middlewares/statistic')

var MongoStore = require('connect-mongo')
// console.log(config)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
  origin: 'http://localhost:9528',
  credentials: true,
  maxAge: '1728000'
  //这一项是为了跨域专门设置的
}))
app.use(Statistic.apiRecord)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  name: config.session.name,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: config.session.cookie,
  store: MongoStore.create({
    mongoUrl: config.url
  })
}))
app.use(express.static(path.join(__dirname, 'public')));


mount(app, path.join(process.cwd(), '/routes'), true)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;