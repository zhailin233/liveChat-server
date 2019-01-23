var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let bodyParser = require('body-parser'); //post 请求
let mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/recruiment-datas';
mongoose.connect(DB_URL);
mongoose.connection.on('connected',()=>{
  console.log('mongodb 连接成功')
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); 
app.use(bodyParser.json()); //解析post传过来的json数据
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); //解析cookie数据
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
