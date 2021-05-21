var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var session = require('express-session');
var db = require('./confiq/connection')
var uplodeFiles = require('express-fileupload')

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const e = require('express');
const { handlebars } = require('hbs');


var app = express();

const hbsHelper = hbs.create({
  extname:'hbs',
  defaultLayout:'layout',
  layoutsDir:__dirname+'/views/layout/',
  partialsDir:__dirname+"/views/partial/",

  helpers:{
    ifequals:function(v1,v2){
    if(v1===v2){
      console.log(v1+' & '+v2)
      return 'checked'
    }else{
      return false
    }
    },
    count:function(index){
      return index+1
    }
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbsHelper.engine )

app.use(logger('dev'));
app.use(uplodeFiles())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"key",cookie:{maxAge:1000000}}))
db.connect((err)=>{
  if(err)console.log('error',err)
  else console.log('success')
})

app.use('/', userRouter);
app.use('/admin', adminRouter);

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
